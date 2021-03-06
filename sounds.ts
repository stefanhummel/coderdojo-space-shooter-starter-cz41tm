export class Sounds {
  static laser: HTMLAudioElement;
  static explosion: HTMLAudioElement;
  static powershot: HTMLAudioElement;
  static megashot: HTMLAudioElement;

  static preload() {
    Sounds.laser = new Audio(
      "https://raw.githubusercontent.com/coderdojo-linz/coderdojo-linz.github.io/develop/static/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/assets/laser-short.mp3"
    );

    Sounds.explosion = new Audio(
      "https://raw.githubusercontent.com/coderdojo-linz/coderdojo-linz.github.io/develop/static/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/assets/explosion.mp3"
    );

    Sounds.powershot = new Audio(
      "https://raw.githubusercontent.com/coderdojo-linz/coderdojo-linz.github.io/develop/static/uebungsanleitungen/programmieren/web/space-shooter-mit-p5js/source/assets/powershot.mp3"
    );

    Sounds.megashot = new Audio(
      "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
    );
  }
}
