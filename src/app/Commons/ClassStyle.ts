
/**
 * a simple object that holds a Class member and Style member
 * intended use in components whose class and style are dynamic bound with ngClass and ngStyle
 *
 * <component [ngClass] ="ClassStyle.Class" [ngSytle]="ClassStyle.Style"></component>
 */
export default class ClassStyle {
    Class: any;
    Style: any;
}
