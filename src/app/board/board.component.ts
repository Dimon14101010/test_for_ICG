import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {FirebaseListObservable, AngularFireDatabase} from "angularfire2/database";
import {DragulaService} from "ng2-dragula";
import {BsModalComponent} from "ng2-bs3-modal";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  newGroup = {};
  newTask = {};
  groupsArray = {};
  taskArray: any = [];
  tempName = {
    name: ''
  };
  article: any;
  taskBoards: FirebaseListObservable<any[]>;
  taskGroups: FirebaseListObservable<any[]>;
  taskList: FirebaseListObservable<any[]>;
  cloneArray = [];
  tasks = {};
  taskListLength;
  endTime: any;
  times: FirebaseListObservable<any[]>;
  descs: FirebaseListObservable<any[]>;
  keyModal;
  timeFlag = true;
  movedObj = {
    startBlock: '',
    endBlock: '',
    value: '',
    startPos: 0,
    endPos: 0,
    id: 0,
    orderIndex: 0,
    insideID : ''
  };
  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private dragulaService: DragulaService) {
    this.times = this.db.list('/times/');
    this.descs = this.db.list('/descriptions/');
    this.article = this.route.snapshot.url[1].path;
    this.taskBoards = db.list('/boards/name');
    this.taskGroups = db.list('/boards/' + this.article + '/groups/name');
    this.taskList = db.list('/boards/' + this.article + '/groups/tasks/');
    this.taskGroups.subscribe((groups) => {
      this.groupsArray = groups.length + 1;
      groups.forEach(insGroups => {
        this.tasks[insGroups.$key] = db.list('/boards/' + this.article + '/groups/tasks/' + insGroups.$key);
        this.tasks[insGroups.$key]
          .subscribe(taskList => {this.taskArray.push({id: insGroups.$key, orderIndex: taskList.length})});
      });
    })
    this.taskList.subscribe(list => list.forEach(tasks => {
      this.cloneArray.push(tasks);
    })
    );

    dragulaService.drag.subscribe((value) => {
      this.taskList.subscribe(list => list.forEach(task => {
        if (task.$key === value[2].id) {
          this.movedObj.value = task[value[1].id].name;
          this.movedObj.id = task[value[1].id].id;
          this.movedObj.startPos = task[value[1].id].orderIndex;
          this.movedObj.startBlock = value[2].id;
          this.movedObj.insideID = value[1].id;
        }
      }));
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      if (value[4]) {
        this.taskList.subscribe(list => list.forEach(task => {
            if (task.$key === value[2].id) {
              this.movedObj.endBlock = value[2].id;
              this.movedObj.endPos = task[value[4].id].orderIndex - 1;
            }
          })
        );
      }
      else {
        this.db.list('/boards/' + this.article + '/groups/tasks/' + value[2].id).
          subscribe(list => this.movedObj.endPos = list.length - 1);
        this.movedObj.endBlock = value[2].id;
      }
      this.onDrop(value.slice(1));
    });
  }

  ngOnInit() {
  }
  private onDrag(args) {
    let [e, el] = args;
  }

  private onDrop(args) {
    if (this.movedObj.startBlock === this.movedObj.endBlock) {
      if (this.movedObj.startPos < this.movedObj.endPos) {
        this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
          .subscribe(list => {
            list.forEach(task => {
              for (let i = this.movedObj.startPos; i < list.length; i++) {
                if (task.orderIndex <= this.movedObj.endPos && task.orderIndex !== 0) {
                  this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
                    .update(task.$key, {orderIndex: task.orderIndex - 1});
                }
              }
            });

            this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.startBlock)
              .remove(this.movedObj.insideID);
            this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
              .push({id: this.movedObj.id, name: this.movedObj.value, orderIndex: this.movedObj.endPos});
          });
      } else {
        this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
          .subscribe(list => {
            list.forEach(task => {
              for (let i = this.movedObj.endPos; i < this.movedObj.startPos; i++) {
                if (task.orderIndex > this.movedObj.endPos && task.orderIndex !== list.length - 1) {
                  this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
                    .update(task.$key, {orderIndex: task.orderIndex + 1});
                }
              }
            });

            this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.startBlock)
              .remove(this.movedObj.insideID);
            this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
              .push({id: this.movedObj.id, name: this.movedObj.value, orderIndex: this.movedObj.endPos + 1});
          });
      }
    } else {
      this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
        .subscribe(list => {
          list.forEach(task => {
            for (let i = this.movedObj.endPos; i < list.length; i++) {
              if (task.orderIndex > this.movedObj.endPos) {
                this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
                  .update(task.$key, {orderIndex: task.orderIndex + 1});
              }
            }
          });
          this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.startBlock)
            .remove(this.movedObj.insideID);
          this.db.list('/boards/' + this.article + '/groups/tasks/' + this.movedObj.endBlock)
            .push({id: this.movedObj.id, name: this.movedObj.value, orderIndex: this.movedObj.endPos + 1});
        })
    }
  }
  addGroup (value) {
    this.newGroup = {
      id: this.groupsArray,
      name: value,
      orderIndex: this.groupsArray
    };
    this.taskGroups.push(this.newGroup);
  }
  addTask (name, key) {
    this.db.list('/boards/' + this.article + '/groups/tasks/' + key)
      .subscribe(list => {this.taskListLength = list.length;});
    this.newTask = {
      id : this.taskListLength + key,
      name : name,
      orderIndex: this.taskListLength
    };
    this.db.list('/boards/' + this.article + '/groups/tasks/' + key).push(this.newTask);
  }
  @ViewChild('modal')
  modal: BsModalComponent;
  close(){
    this.timeFlag = true;
    this.modal.close();
  }
  modOpen(key) {
    this.keyModal = key;
    this.db.list('/times').subscribe(res => res.forEach(result => {
      if (result.id === key) {
        this.timeFlag = false;
      }
    }));
    this.modal.open();
  }
  setEndPoint (endPointDate) {
    this.endTime = endPointDate.toLocaleDateString();
    this.db.list('/times').push({id: this.keyModal, expDate: this.endTime});
  }
  updateEndPoint(endPointDate) {
    this.endTime = endPointDate.toLocaleDateString();
    let newTime;
    this.db.list('/times').subscribe(res => res.forEach(result => {
      if (result.id === this.keyModal) {
        this.db.list('/times').update(result.$key, {expDate: this.endTime});
      }
    }));
  }
  setDesc(desc) {
    this.db.list('/descriptions').push({id: this.keyModal, value: desc})
  }
}


