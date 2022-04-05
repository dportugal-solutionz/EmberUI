import  ClassStyle from '../../Commons/ClassStyle';

/**
 * Button state properties which affects the look of the button.
 */
export class ButtonStateProperties {

    /**
     * text applied to the button
     */
    Label : string = '';
    LabelCS : ClassStyle = {
        Class:'',
        Style:''
    };
    /**
     * the img src as an icon of the button
     */
    Icon : string = '';
    IconCS : ClassStyle = {
        Class:'',
        Style:''
    };
    /**
     * the img src as the background image
     */
    BackgroundImage : string = '';
    BackgroundCS : ClassStyle = {
        Class:'',
        Style:''
    };

    ButtonCS : ClassStyle = {
        Class:'',
        Style:''
    };


    /**
     * creates a ButtonStateProperty object
     * @returns a new ButtonStateProperty object
     */
    static DefaultIdle() : ButtonStateProperties {
        return {
            Label : '',
            Icon : '',
            BackgroundImage : '',
            LabelCS : {
                Class: '',
                Style: ''
            },
            IconCS : {
                Class: '',
                Style: ''
            },
            BackgroundCS :{
                Class: '',
                Style: ''
            },
            ButtonCS:{
                Class: 'bg-idle',
                Style: ''
            }
        }
    }

    /**
     * creates a ButtonStateProperty object
     * @returns a new ButtonStateProperty object
     */
    static DefaultPressed() : ButtonStateProperties {
        return {
            Label : '',
            Icon : '',
            BackgroundImage : '',
            LabelCS : {
                Class: '',
                Style: ''
            },
            IconCS : {
                Class: '',
                Style: ''
            },
            BackgroundCS :{
                Class: '',
                Style: ''
            },
            ButtonCS:{
                Class: 'bg-pressed',
                Style: ''
            }
        }
    }

    /**
     * creates a ButtonStateProperty object
     * @returns a new ButtonStateProperty object
     */
    static DefaultSelected() : ButtonStateProperties {
        return {
            Label : '',
            Icon : '',
            BackgroundImage : '',
            LabelCS : {
                Class: '',
                Style: ''
            },
            IconCS : {
                Class: '',
                Style: ''
            },
            BackgroundCS :{
                Class: '',
                Style: ''
            },
            ButtonCS:{
                Class: 'bg-selected',
                Style: ''
            }
        }
    }
};