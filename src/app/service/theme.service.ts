import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";

import repoList from "../themeList.json";

export interface ITheme{
    graphLineColor: string;
    commitGraphColor: string;
    languageGraphColors: string[];
    spinnerColor: string;
    cssFilePath: string;
}

@Injectable()
export class ThemeService{
    private static DEFAULT_THEME = 'Classic';

    private static themeList: {themeName: string, themePath: string}[] = repoList;

    private currentTheme: ITheme = {
        graphLineColor: "#6A6A6A",
        commitGraphColor: "#1D8F6D",
        languageGraphColors: ["#1D8F6D", "#385855", "#CFC69B", "#90D7FF", "#896978", "#F45B69"],
        spinnerColor: "#1D8F6D",
        cssFilePath: "assets/theme/css/classic.css"
    };

    private themeName: string = ThemeService.DEFAULT_THEME;

    private themeObs: Subject<ITheme> = new Subject();

    constructor(private httpService: HttpClient, private toastr: ToastrService){
        let themeName = localStorage.getItem('theme') || '';
        if(ThemeService.themeList.find((obj)=>obj.themeName === themeName) !== undefined){
            this.loadCurrentTheme(themeName);
        }
        else{
            this.loadCurrentTheme(ThemeService.DEFAULT_THEME);
        }
    }

    loadCurrentTheme(themeName: string) {
        this.themeName = themeName;
        let themePath = ThemeService.themeList.find((obj)=>obj.themeName === themeName)?.themePath;
        if(themePath !== undefined)
            this.httpService.get<ITheme>(themePath).subscribe({
                next: (data: ITheme)=>{
                    localStorage.setItem('theme', this.themeName);
                    this.currentTheme = data;
                    this.loadThemeCss(this.currentTheme.cssFilePath);
                    this.themeObs.next(this.currentTheme);
                },
                error: (error) => {
                    this.toastr.error("Error occured while fetching theme details", "Error");
                }
                
            });
    }

    getThemeObs(): Subject<ITheme>{
        return this.themeObs;
    }

    getThemeColorScheme(): ITheme{
        return this.currentTheme;
    }

    setTheme(themeName: string) {
        if(ThemeService.themeList.find((obj)=>obj.themeName === themeName) !== undefined){
            this.loadCurrentTheme(themeName);
        }
    }

    setNextTheme() {
        let nextIndex = (ThemeService.themeList.findIndex((obj)=>obj.themeName === this.themeName) + 1) % ThemeService.themeList.length;
        this.setTheme(ThemeService.themeList[nextIndex].themeName);
        
    }

    setPreviousTheme() {
        let previousIndex = (ThemeService.themeList.findIndex((obj)=>obj.themeName === this.themeName) - 1);
        if(previousIndex === -1) previousIndex = ThemeService.themeList.length -1;
        this.setTheme(ThemeService.themeList[previousIndex].themeName);
        
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