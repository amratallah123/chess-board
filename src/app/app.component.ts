import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';
import { environment } from 'src/environments/environment';
import { Message } from './models/message';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
// implements OnInit
export class AppComponent implements OnChanges, OnInit {
  boardSize: number = 400;
  @Input() fen!: string;
  @Input() boardHistory!: any[];
  ready: boolean = false;

  constructor(private ngxChessBoardService: NgxChessBoardService) {}
  @ViewChild('board', { static: false }) board: NgxChessBoardView | undefined;
  sendMessage() {
    if (
      this.boardHistory != null &&
      this.board?.getMoveHistory()[this.board?.getMoveHistory().length - 1]
        .mate &&
      this.board?.getMoveHistory()[this.board?.getMoveHistory().length - 1]
        .check
    ) {
      if (confirm('Do you want play another game')) {
        this.reset();
        parent.postMessage('reset', environment.mainPageURL);
      }
    } else {
      let message: Message = {
        fen: this.board?.getFEN(),
        boardHistory: this.board?.getMoveHistory(),
      };
      parent.postMessage(message, environment.mainPageURL);
    }
  }
  paintTheBoard(FEN: string) {
    this.board?.setFEN(FEN);
  }
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];
      let current = JSON.stringify(change.currentValue);
      let previous = JSON.stringify(change.previousValue);
      console.log(current + ' ', previous);
    }
  }
  handleMessage(event: Event) {
    const message = event as MessageEvent;
    if (message.data == 'reset') {
      this.reset();
    } else if (
      message.data.fen != null &&
      message.data.fen.length > 0 &&
      message.data.boardHistory != null &&
      message.data.boardHistory.length > 0
    ) {
      this.fen = message.data.fen;
      this.boardHistory = message.data.boardHistory;
      console.log(this.boardHistory);
      this.paintTheBoard(this.fen);
      console.log('message from board:', message.data);
    }
  }
  resetGame() {
    this.reset();
    parent.postMessage('reset', environment.mainPageURL);
  }
  reset(): void {
    this.board?.reset();
  }
  async loadDate() {
    await window.addEventListener('message', this.handleMessage.bind(this));
  }
  async ngOnInit() {
    await this.loadDate().then((s) => {
      this.ready = true;
    });
  }
}
