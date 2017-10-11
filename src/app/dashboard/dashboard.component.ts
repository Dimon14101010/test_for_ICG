import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase , FirebaseListObservable} from "angularfire2/database";
import {BsModalComponent} from "ng2-bs3-modal";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  taskBoards: FirebaseListObservable<any[]>;
  taskGroups: FirebaseListObservable<any[]>;
  taskList: FirebaseListObservable<any[]>;
  newBoard = {};
  boardsArray = {};
  boardName;
  lastName;
  constructor(db: AngularFireDatabase) {
    this.taskBoards = db.list('/boards/name');
    this.taskGroups = db.list('/boards/groups');
    this.taskList = db.list('/groups/tasks');
    this.taskBoards.subscribe(result => this.boardsArray = result.length + 1);
  }

  ngOnInit() {
  }

  addBoard () {
  }
  @ViewChild('validationModal')
  modal: BsModalComponent;
  open () {
    this.modal.open();
  }
  close (name) {
    console.log('works', this.boardsArray, name);
    this.taskBoards.push({id: this.boardsArray, name});
    this.modal.close();
  }

}
