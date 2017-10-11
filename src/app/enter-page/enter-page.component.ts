import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-enter-page',
  templateUrl: './enter-page.component.html',
  styleUrls: ['./enter-page.component.css']
})
export class EnterPageComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  register(email, pass) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, pass);
  }
  login(email, pass) {
    this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }
}
