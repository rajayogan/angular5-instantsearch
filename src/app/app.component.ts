import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  searchterm: string;

  startAt = new Subject();
  endAt = new Subject();

  clubs;
  allclubs;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {
    this.getallclubs().subscribe((clubs) => {
      this.allclubs = clubs;
    })
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((clubs) => {
        this.clubs = clubs;
      })
    })
  }

  search($event) {
    let q = $event.target.value;
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.clubs = this.allclubs;
    }
  }

  firequery(start, end) {
    return this.afs.collection('epl', ref => ref.limit(4).orderBy('club').startAt(start).endAt(end)).valueChanges();
  }

  getallclubs() {
    return this.afs.collection('epl', ref => ref.orderBy('club')).valueChanges();
  }


}
