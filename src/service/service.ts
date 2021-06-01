import { UserSchema } from "../schema/user.schema";
import * as jwt from "jsonwebtoken";
import { IEmailInfo, ILoginInfo, IUserInformation } from "../interfaces/IUser.interface";
import EmailService from "./send.mail";
import * as paypal from "paypal-rest-sdk"
class Service {

  private mailService : EmailService;
  constructor(){
    this.mailService = new EmailService();
  }

  /* function to create new User */
  public async signUp(userInformation: IUserInformation): Promise<any> {
    try {
      const user = new UserSchema({
        userName: userInformation.userName,
        firstName: userInformation.firstName,
        lastName: userInformation.lastName,
        password: userInformation.password,
        emailId: userInformation.emailId,
        phoneNumber: userInformation.phoneNumber,
        appUser: userInformation.appUser,
        userType: userInformation.userType,
        documentUrl: userInformation.documentUrl,
      });

      return await user.save();
    } catch (err) {
      console.log("Exception occured in signUp", err);

      throw err
    }
  }

    /* function to Login and get accessToken and RefreshToken */
    public async signIn(userInformation: any): Promise<any> {
      try {
       
        const user = {
          userName: userInformation.userName,
          emailId: userInformation.emailId
        }

        const userDbInfo = await UserSchema.find({'emailId': userInformation.emailId}).exec()

        if(userDbInfo.length){

          const token = await this.generateRefreshToken(user);
          const refreshtoken = await this.generateAccessToken(user)
  
          return {
            status: true,
            message: "Signin Successfully.",
            data: {
              status: true,
              token,
              refreshtoken,
            },
            userType: userDbInfo[0]['userType'],
            userDbInfo
          }
        }else{

          throw new Error('User Not found, Please signUp or please check your mail')
        }

      } catch (err) {
        console.log("Exception occured in signIn", err);
  
        throw err
      }
    }

    public async getUsers(): Promise<any> {

      try {
        
        return await  UserSchema.find({'userType': 'Public'}).exec()
      } catch (error) {
        
        console.log('error while getting user list from db ', error )

        throw error
      }   
    }

    public async sendMail(emailInfo: IEmailInfo): Promise<any> {

      try {

       const mailOption = {
        to: emailInfo.emailId,
        subject: emailInfo.subject,
        text: emailInfo.emailBody
       }

       return await this.mailService.sendMail(mailOption);
           
      } catch (error) {
        
        console.log('error while sendMail ', error )

        throw error
      }   
    }
    public async getAdmins(user: ILoginInfo): Promise<any> {

      try {

        if(user.userType === 'admin'){
          return await  UserSchema.find({'userType': 'admin'}).exec()
        }
        throw new Error('Only admin can view the admin list, You are not allowed')
           
      } catch (error) {
        
        console.log('error while getting user list from db ', error )

        throw error
      }   
    }

  public async subscriptions (req: any, res: any) {




    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "https://alsiraj-node.herokuapp.com/success",
          "cancel_url": "https://alsiraj-node.herokuapp.com/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Alsiraj membership",
                  "sku": "001",
                  "price": "5.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "5.00"
          },
          "description": "Hat for the best team ever"
      }]
  };
  

      console.log( 'payment', create_payment_json ); 

      // call the create Pay method 
      await this.createPayment( create_payment_json ) 
        .then( ( transaction ) => {

          console.log( 'transaction', transaction ); 
            var id = transaction['id']; 
            var links = transaction['links'];
            var counter = links.length; 
            while( counter -- ) {
              if ( links[counter].method == 'REDIRECT') {
                // redirect to paypal where user approves the transaction 
                          return res.redirect( links[counter].href )
                      }
            }
        })
        .catch( ( err ) => { 
            console.log( err ); 
            res.redirect('/err');
        });

  }

  private async generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
  }

  private async generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' })
  }

  private async createPayment(payment: any){
    return new Promise( ( resolve , reject ) => {
      paypal.payment.create( payment , function( err , payment ) {
       if ( err ) {
           reject(err); 
       }
      else {
          resolve(payment); 
      }
      }); 
  });
  }

}

export default Service;
