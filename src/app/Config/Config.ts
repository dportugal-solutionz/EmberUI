/*
    Must be syncronized with the C# classes of Ember\Configuration\JsonClasses
*/

export default interface Config {
    Room: Room;
    Matrices: Matrix[];
    Sources: Source[];
    Destinations: Destination[];
    Displays: Display[];
    DSP: Dsp;
    Cameras: any[];
    Recorders: Recorder[];
    RoutingRules: any[];
    PresetRoutes: PresetRoute[];
    Touchpanels: Touchpanel[];

  }

  export interface Room {
    Site: string;
    RoomName: string;
    UseExternalDsp: boolean;
    DisplayAutoOn: boolean;
    Startup: RoomStartupShutdownSettings;
    Shutdown : RoomStartupShutdownSettings;
    VTCShareDestination: number;
    Audio: RoomAudio;
    Combinable: boolean;
    CombinablePosition: string;
  }

  export interface RoomStartupShutdownSettings {
    PresetRoute: number;
    ProgramVolumeLevel: number;
    MicVolumeLevel: number;
    VtcVolumeLevel: number;
    DspPreset: number;
  }


  export interface RoomAudio {
    ProgramVolume: RoomAudioObject;
    MicVolume: RoomAudioObject;
    AtcVolume: RoomAudioObject;
    VtcVolume: RoomAudioObject;
    PrivacyMute: RoomAudioObject;
  }

  export interface RoomAudioObject {
    DMAddress: number;
    DSPFader: number;
  }

  export interface Matrix {
    Id: number;
    Label: string;
    Inputs: number;
    InputLabels: string[];
    Outputs: number;
    OutputLabels: string[];
    IP : string;
    Username : string;
    Password : string;
  }

  export interface Source {
    Id: number;
    Label: string;
    Icon: string;
    ShowControls: string;
    Message: string;
    Input: number;
    Matrix: number;
    IrPort: string;
    SerialPort: string;
    DeviceIndex: number;
    DriverPath: string;
    DisableDestinations: any[];
    GroupTags: string[];
    HiddenFromRoom : number[];
  }

  export interface Destination {
    Id: number;
    Label: string;
    Icon: string;
    Matrix: number;
    Output: number;
    ShowVideoMute: boolean;
    HiddenFromRoom : number[];
    CurrentSource : Source;
  }

  export interface Display {
    Id: number;
    Label: string;
    Icon: string;
    IsAProjector: boolean;
    HasScreen: boolean;
    DriverPath: string;
    SerialPort: string;
    IrPort: string;
    CecPort: string;
    IP: string;
    IPPort: string;
    Username: string;
    Password: string;
    HiddenFromRoom: any[];
  }

  export interface Dsp {
    IP: string;
    Username: string;
    Password:string;
    Voip: Voip;
    Faders: Fader[];
    Presets: string[];
  }

  export interface Voip {
    Enable: boolean;
    EnableRxVol: boolean;
    RxLevelInstanceTag: string;
    RxLevelChannel: number;
    RxMuteInstanceTag: string;
    RxMuteChannel: number;
    EnablePrivacy: boolean;
    PrivacyInstanceTag: string;
    PrivacyChannel: number;
    ControlStatusInstanceTag : string;
    DialerInstanceTag : string;
  }

  export interface Fader {
    Id: number;
    Label: string;
    HasLevel: boolean;
    HasMute: boolean;
    MuteType: number;
    LevelControl: string;
    LevelIndex: number;
    MuteControl: string;
    MuteIndex: number;
    GroupTags: string[];
    HiddenFromRoom : number[];
  }

  export interface Recorder {
    IP: string;
    Port: string;
    Username: string;
    Password: string;
    HiddenFromRoom : number[];
  }

  export interface PresetRoute {
    Id: number;
    Label: string;
    Routes: Route[];
  }
  export interface Route {
    Source: number;
    Destination : number;
    AllDestinations: boolean;
  }

  export interface Touchpanel {
    Id: number;
    Startup: TouchpanelStartup;
    Menus: Menu[];
    TechMenus: TechMenu[];
    PageStyles: PageStyles;
    SourcesVisible: boolean[];
    DestinationsVisible: boolean[];
    VideoWallLayoutVisible: boolean[];
    DisplaysVisible: boolean[];
    AudioGroups: string[];
    FadersVisible: boolean[];
    CamerasVisible: boolean[];
    VideoConference: TouchpanelVideoConference;
    VideoWallLayoutsVisible : boolean[];
  }

  export interface TouchpanelStartup {
    Menu: number
    AudioGroup: number
    Source: number
    Camera: number
  }

  export interface Menu {
    Id: number
    Visible: boolean
    Label: string
    Icon: string
    Description: string
    Source: number
    Password: string
  }

  export interface TechMenu {
    Id: number;
    Visible: boolean;
    Label: string;
  }

  export interface PageStyles {
    Volume: number;
    Routing: number;
  }

  export interface TouchpanelVideoConference {
    ShareSourceVisibility: boolean[]
  }
