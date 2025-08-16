import Axios from "axios";
import {MessageBox} from "element-ui";


let cameraVideoUrl:any = 'http://localhost:8687/camera/mjpeg';
let cameraImageUrl = 'http://localhost:8687/camera/jpeg';
let cameraTokenImageUrl = "http://localhost:8686/camera/usb/imagetoken";
let cameraWebsocketUrl = 'ws://localhost:8688';
let cameraControlUrl = 'http://localhost:8686/camera/usb/';

export async function start(cameraIndex: any)
{
    let axi = Axios.create();
    let url = cameraControlUrl + "start/" + cameraIndex;
    await axi.get(url);
    // let promise = new Promise((resolve, reject) => {
    //     MessageBox.alert(message, title, {
    //         type: "error",
    //         confirmButtonText: 'Re-login',
    //         callback: (action: any) => {
    //             console.log(action);
    //             resolve("confirmed");
    //         }
    //     })
    // });
};

export async function wsConnect(callback: any) {

};

export async function stopCamera(cameraIndex: any, callback: any) {
    let axi = Axios.create();
    let url = cameraControlUrl + "stop/" + cameraIndex;
    console.log(url);
    axi.get(url);
};
