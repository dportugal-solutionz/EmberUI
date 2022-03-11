declare var CrComLib: typeof import('@crestron/ch5-crcomlib');
import { CommandEmitJoin } from '../Config/StaticJoinNumbers';


/**
 * Sends command to the Control System that a button was pushed, slider changed, etc.
 * @param component the object, button that will send to the control system
 */
export function SendCommand( component: any )
{
    let str = "!!CMD-START!!";
    str += JSON.stringify(component);
    str += "!!CMD-END!!";
    CrComLib.publishEvent(CommandEmitJoin.Type,CommandEmitJoin.Number,str);
}