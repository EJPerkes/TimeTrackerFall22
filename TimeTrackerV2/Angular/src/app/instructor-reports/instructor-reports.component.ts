import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

// Interfaces
// interface TimeLog {
//     date: Date;
//     hours: number;
// }

interface Project {
    name: string;
    totalTime: string;
}

// interface Course {
//     title: string;
//     projects: Project[];
// }

interface StudentReport {
    cardID: number;
    studentName: string;
    projects: Project[];
}

@Component({
    selector: 'app-instructor-reports',
    templateUrl: './instructor-reports.component.html',
    styleUrls: ['./instructor-reports.component.css']
})
export class InstructorReportsComponent implements OnInit {

    reports: StudentReport[] = [];
    expandedCards: { [cardID: number]: boolean } = {};

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // The below line of code will grab the section of the URL that is ":id" and store it into the variable courseID.  Where I found this code https://stackoverflow.com/questions/44864303/send-data-through-routing-paths-in-angular
        // The '!' at the end is the "non-null assertion operator", this tell the TypeScript compiler that a value is not null or undefined, even if its type suggests that it might be
        let courseID: string = this.route.snapshot.paramMap.get('id')!;

        this.reports = this.getStudentReports(courseID);
    }

    // Method to toggle expanded state of student card
    toggleCard(cardID: number) {
        this.expandedCards[cardID] = !this.expandedCards[cardID];
        var cardArrow = document.getElementById(cardID.toString());
        // console.log(cardArrow);
        //make sure that the element fetched is not null before changing it's class name
        if (cardArrow === null) {
            alert('oops, there is no element with the ID of ' + cardID);
        }
        else {
            // since you've done the nullable check
            // TS won't complain from this point on
            // if they are expanding the card, change the image's class to be collapsedArrow, otherwise change it to expandedArrow
            this.expandedCards[cardID] ? cardArrow.className = "collapseArrow" : cardArrow.className = "expandArrow";
        }
    }

    // Grab a list of students registered for the course and the totalTimes for their projects
    getStudentReports(courseID: string): StudentReport[] {
        let returnData: StudentReport[] = []

        this.http.get(`http://localhost:8080/api/Course/${courseID}/userTotalTimes`).subscribe((data: any) => {
            // console.log("Data returned\n" + JSON.stringify(data));

            let cardID: number = 1;
            // for every entry in data
            data.forEach((entry: any) => {
                // console.log("Processing the data:\n" + JSON.stringify(entry));
                var toBeAdded: StudentReport = {
                    cardID,
                    studentName: entry.studentName,
                    projects: [],  // See about using map here
                };

                // for every project in entry.projects
                entry.projects.forEach((project: any) => {
                    toBeAdded.projects.push({
                        name: project.projectName,
                        totalTime: project.totalTime,
                    });
                });

                // after processing the data, add it to the array "returnData" and increment the value of cardID
                returnData.push(toBeAdded);
                cardID++;
            });
        });

        return returnData;

        // return [
        //     {
        //         cardID: 1,
        //         studentName: 'John Doe',
        //         projects: [
        //             {
        //                 name: 'Project 1',
        //                 totalTime: "5 Hours"
        //             },
        //             {
        //                 name: 'Project 2',
        //                 totalTime: "4 Hours"
        //             }
        //         ]
        //     },
        //     {
        //         cardID: 2,
        //         studentName: 'Jane Smith',
        //         projects: [
        //             {
        //                 name: 'Project 1',
        //                 totalTime: "3 Hours"
        //             }
        //         ]
        //     }
        // ];
    }
}