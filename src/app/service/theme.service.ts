import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ITheme{
    graphLineColor: string;
    commitGraphColor: string;
    languageGraphColors: string[];
    spinnerColor: string;
    cssFilePath: string;
}

@Injectable()
export class ThemeService{
    private static themeList : {[key: string]: ITheme} = {
        'light': {
            graphLineColor: "#6A6A6A",
            commitGraphColor: "#1D8F6D",
            languageGraphColors: ['#1D8F6D', '#385855', '#CFC69B', '#90D7FF', '#896978', '#F45B69'],
            spinnerColor: "#1D8F6D",
            cssFilePath: "assets/theme/css/light.css"
        },
        'dark': {
            graphLineColor: "#D2D2D2",
            commitGraphColor: "#1D8F6D",
            languageGraphColors: ['#1D8F6D', '#385855', '#CFC69B', '#90D7FF', '#896978', '#F45B69'],
            spinnerColor: "#1D8F6D",
            cssFilePath: "assets/theme/css/dark.css"
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
        this.loadThemeCss(ThemeService.themeList[this.themeName].cssFilePath);

    }

    getThemeObs(): Subject<ITheme>{
        return this.themeObs;
    }

    getThemeColorScheme(): ITheme{
        return ThemeService.themeList[this.themeName];
    }

    setTheme(theme: string) {
        this.themeName = theme;
        localStorage.setItem('theme', this.themeName);
        this.loadThemeCss(ThemeService.themeList[this.themeName].cssFilePath);
        this.themeObs.next(ThemeService.themeList[this.themeName]);
    }

    getThemeName(): string {
        return this.themeName;
    }

    private loadThemeCss(path: string) {
        const head = document.getElementsByTagName('head')[0];

        let themeLink = document.getElementById(
                        'client-theme'
                        ) as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = path;
        } else {
            const style = document.createElement('link');
            style.id = 'client-theme';
            style.rel = 'stylesheet';
            style.href = `${path}`;

            head.appendChild(style);
        }
    }
}