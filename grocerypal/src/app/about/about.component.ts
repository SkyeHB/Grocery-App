import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    
    date: Date = new Date();
    dates: Array<any> = [];

    weekDays: Array<string> = [
        "Sunday", 
        "Monday", 
        "Tuesday", 
        "Wednesday", 
        "Thursday", 
        "Friday", 
        "Saturday"
    ];
    months: Array<string> = [
        "Jan", 
        "Feb", 
        "Mar", 
        "Apr", 
        "May", 
        "Jun", 
        "Jul", 
        "Aug", 
        "Sep", 
        "Oct", 
        "Nov", 
        "Dec"
    ];
    openTimes: Array<string> = [
        "6:00 AM", 
        "6:00 AM", 
        "6:00 AM", 
        "6:00 AM", 
        "6:00 AM", 
        "6:00 AM", 
        "6:00 AM"
    ];
    closeTimes: Array<string> = [
        "10:00 PM", 
        "8:00 PM", 
        "8:00 PM", 
        "8:00 PM", 
        "8:00 PM", 
        "8:00 PM", 
        "10:00 PM"
    ];

    constructor() { }

    ngOnInit(): void {
        
        // Get today and the next 6 days (a full week)
        //
        for (let i = 0; i < 7; i++) {

            var day = {

                // Week day (Sunday, Monday, etc.)
                //
                weekDay: this.weekDays[this.date.getDay()],
                
                // Time it opens on that week day
                //
                openTime: this.openTimes[this.date.getDay()],
                
                // Time it closes on that week day
                //
                closeTime: this.closeTimes[this.date.getDay()],
                
                // Month (Jan, Feb, etc.)
                //
                month: this.months[this.date.getMonth()],
                
                // Day number (1-31)
                //
                dayNumber: this.date.getDate(),
            }

            this.dates.push(day);
            
            // Add a day
            //
            this.date.setDate(this.date.getDate() + 1);
        }
    }

}
