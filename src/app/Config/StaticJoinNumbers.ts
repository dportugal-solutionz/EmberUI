/**
 * A CrComLib friendly class for use in subscribe,get,and publishing states
 */
class ISimpleJoins{
    Type: any //TSignalNonStandardTypeName;
    Number: string;
    constructor (type : any, num: string)
    {
        this.Type = type;
        this.Number = num;
    }
}

/**
 * The touch panel will receive the config on this join
 */
export const ConfigJoin            : ISimpleJoins = new ISimpleJoins('s','1');
/**
 * The touch panel will send to the control system on this join, LogEvents
 */
export const LoggerEmitJoin        : ISimpleJoins = new ISimpleJoins('s','2');
/**
 * The touch panel will send to the control system on this join, Commands from button pushes, sliders, or any other component
 */
export const CommandEmitJoin       : ISimpleJoins = new ISimpleJoins('s','3');

export const TpIpAddressJoin       : ISimpleJoins = new ISimpleJoins('s','Csig.Ip_Address_fb');
export const TpMacAddressJoin      : ISimpleJoins = new ISimpleJoins('s','Csig.MAC_Address_fb');
export const TpRoomNameJoin        : ISimpleJoins = new ISimpleJoins('s','Csig.Room_Name_fb');
export const TpOnlineJoin          : ISimpleJoins = new ISimpleJoins('b','Csig.All_Control_Systems_Online_fb');
export const TpOfflineJoin         : ISimpleJoins = new ISimpleJoins('b','Csig.Control_System_Offline_fb');
export const TpIpTableEntry1       : ISimpleJoins = new ISimpleJoins('s','33104');
export const TpIpTableEntry2       : ISimpleJoins = new ISimpleJoins('s','33106');
export const TpIpTableEntry3       : ISimpleJoins = new ISimpleJoins('s','33108');
export const TpIpTableEntry4       : ISimpleJoins = new ISimpleJoins('s','33110');




