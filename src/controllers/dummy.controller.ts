import {json, Request,Response} from "express"

export default {
    dummy(req:Request, res:Response){
        res.status(200).json({
            message: 'succes hit endpoint/dummy',
            data: 'ok',
        })
    }
};