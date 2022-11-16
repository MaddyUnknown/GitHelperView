import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ITheme{
    graphLineColor: string;
    commitGraphColor: string;
    languageGraphColors: string[];
    spinnerColor: string;
    cssClass: string;
}

@Injectable()
export class ThemeService{
    private static themeList : {[key: string]: ITheme} = {
        'light': {
            graphLineColor: "#6A6A6A",
            commitGraphColor: "#1D8F6D",
            languageGraphColors: ['#1D8F6D', '#385855', '#CFC69B', '#90D7FF', '#896978', '#F45B69'],
            spinnerColor: "#1D8F6D",
            cssClass: "light-theme"
        },
        'dark': {
            graphLineColor: "#D2D2D2",
            commitGraphColor: "#1D8F6D",
            languageGraphColors: ['#1D8F6D', '#385855', '#CFC69B', '#90D7FF', '#896978', '#F45B69'],
            spinnerColor: "#1D8F6D",
            cssClass: "dark-theme"
        }
    }

    private themeObs: Subject<ITheme> = new Subject();

    private themeName: string;

    constructor(){
        let theme = localStorage.getItem('theme') || '';
        if(Object.keys(ThemeService.themeList).includes(theme)){
            this.themeName = theme;
        }
        else{
            this.themeName = 'light';
        }
        setTimeout(()=>{
            document.getElementsByTagName("body")[0].classList.add(ThemeService.themeList[this.themeName].cssClass);
        })
    }

    getThemeObs(): Subject<ITheme>{
        return this.themeObs;
    }

    getThemeColorScheme(): ITheme{
        return ThemeService.themeList[this.themeName];
    }

    setTheme(theme: string) {
        document.getElementsByTagName("body")[0].classList.remove(ThemeService.themeList[this.themeName].cssClass);
        this.themeName = theme;
        localStorage.setItem('theme', this.themeName);
        document.getElementsByTagName("body")[0].classList.add(ThemeService.themeList[this.themeName].cssClass);
        this.themeObs.next(ThemeService.themeList[this.themeName]);
    }

    getThemeName(): string {
        return this.themeName;
    }
}