import axios from "axios";
import { AxiosResponse } from "axios";

export default class CoreService {
    public static sendMail = async (ticketMessage:string, toEmail:string, fromEmail:string, ticketId:string, channelId:string, workspaceId:string): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                const mailURLHost = process.env.CORE_SERVICE_URL + '/internal/communication/send-email';
                console.log('mailURLHost', mailURLHost);

                const sendEmailPayload = {
                    "email": toEmail,
                    "templateId": 27,
                    "params": {
                      ticketlink: `${process.env.WEBSITE_URL}/${workspaceId}/chat?channelId=${channelId}&ticketId=${ticketId}`,
                      ticketmail: fromEmail,
                      ticketmessage: ticketMessage
                    }
                  }
                return axios.post(mailURLHost, sendEmailPayload)
                    .then(async (response: AxiosResponse<any>) => {
                        if (response.status === 200) {
                            return resolve(response.data?.data);
                        } else {
                            return null;
                        }
                    })
                    .catch((error) => {
                        console.error(`Error in Send Mail, Error: ${error?.message || error}`);
                        return resolve(error?.message || error);
                    });
            } catch (error) {
                console.error(`Error in Send Mail, Error: ${error}`);
                return resolve(error);
            }
        });
    }
}