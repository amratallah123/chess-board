import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';
import { Message } from './models/message';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
// implements OnInit
export class AppComponent implements OnChanges {
  boardSize: number = 300;
  @Input() fen: string = '';
  @Input() boardHistory: any[] = [];

  isDisabled: boolean = false;
  constructor(private ngxChessBoardService: NgxChessBoardService) {
    window.addEventListener('message', this.handleMessage.bind(this));
  }
  @ViewChild('board', { static: false }) board: NgxChessBoardView | undefined;
  sendMessage() {
    let message: Message = {
      fen: this.board?.getFEN(),
      boardHistory: this.board?.getMoveHistory(),
    };
    parent.postMessage(message, 'http://localhost:4200/');
  }
  paintTheBoard(FEN: string) {
    this.board?.setFEN(FEN);
  }
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log(cur + ' ', prev);
    }
  }
  handleMessage(event: Event) {
    const message = event as MessageEvent;
    this.fen = message.data.fen;
    this.boardHistory = message.data.boardHistory;
    this.paintTheBoard(this.fen);
  }
}
