import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

// Hardcoded implementation of user preference
/* 
Since dealing with offset and timezone was OUT OF SCOPE for v1 of project,
currently the values in this class are harded coded to offset of '+0530' (offset for IST), but in future this service can be rewritten to implement user preference offset and prefered timezone
*/
@Injectable()
export class UserPreferenceService{
    getPreferedTimeOffset(): string{
        return '+0530';
    }
}