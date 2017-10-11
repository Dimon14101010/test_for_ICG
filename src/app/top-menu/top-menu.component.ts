import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {BsModalComponent} from "ng2-bs3-modal";

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }
  login (email, pass) {
    this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }
  logout() {
    console.log('logOut')
    this.afAuth.auth.signOut();
  }
  @ViewChild('signInModal')
  modal: BsModalComponent;
  open () {
    this.modal.open();
  }
  close () {
    this.modal.close();
  }
}
