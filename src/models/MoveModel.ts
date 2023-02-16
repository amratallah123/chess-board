export interface MoveModel {
  move: string;
  piece: string;
  color: string;
  x: string;
  check: boolean;
  stalemate: boolean;
  mate: boolean;
}
