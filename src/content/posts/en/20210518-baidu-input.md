---
title: "A Plagiarism Journey of a Copycat Baidu Skin"
description: "As a personal input method, don't reinvent the wheel. Copy (plagiarize/borrow) existing input method skin source files and develop in the shortest time."
category: "life"
tags:
  - "roam"
pubDate: 2021-05-18
heroImage: "https://cos.zbz.ai/images/202310181257285.avif"
heroImageAlt: "RealRip-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "en"
---

Baidu input method skin for macOS, minimalist style, highly customizable.

## Skin Features

1. Suitable for Baidu Input Method for Mac.
2. Perfectly adapted to macOS Monterey.
3. Minimalist style, focus on input.
4. Highlight the first choice, focus more on word selection.
5. Highly customizable, can be personalized according to needs.

## Update Log

### `V1.1` 2021-11-05

1. Unified file naming rules.
2. Added remarks for easy customization.
3. Removed the page turning icon on the right, making the whole simpler.
4. Added `global.ini` file.
5. Added graphite skin.
6. Updated skin examples.

### `V1.0` 2021-05-18

1. Skin released.

## Instructions for Use

1. When there are no special needs, you can directly download the `.bdskk` format skin package in the `examples` folder and double-click to install and use.
2. If customization is required, the file can be modified.
3. Compress the content in the skin resource folder into a `.zip` format compressed package, do not compress the entire folder.
4. Modify the compressed package to a `.bdskk` format skin package.
5. Double-click the installation package to import it into Baidu Input Method.

## File Structure

```json
└── src
    ├── global.ini
    ├── horizontal.ini
    ├── single.ini
    ├── statusbar.ini
    └── *.png
└── examples
└── README.md
└── LICENSE
```

1. `src`: Resource folder.

2. `globe.ini`: Global definition file, can define skin name, skin type, skin description, author ID, email, website, etc. Relevant information will be displayed in the Baidu Mac Input Method appearance settings page.

3. `horizontal.ini`: Double-line mode configuration file. Double-line skin refers to the mode that displays input codes and candidate words at the same time.

   **Input area & Candidate word area**: Frame the background image range of the double-line mode, as shown in the figure. The setting principle of each parameter in the two areas is the same.

   **Nine-square area**: The candidate bar background adapts to different candidate word lengths in a nine-square expansion manner. The four parameters X / Y / Width / Height define the green area in the figure below, which is the middle palace of the nine-square grid.

   **Content margin**: The distance between the input code and the edge of the background slice. Approximately

   **Font & Color**: The color of the font and candidate words uses the hexadecimal RGB format. The elements referred to by each field are shown in the figure below:

   **Interval symbol**: Set the interval symbol between the digital serial number and the candidate word. The space is SPACE (uppercase), and other characters are input directly.

4. `single.ini`: Single-line mode configuration file. Single-line skin refers to the mode that only displays candidate words, which looks cleaner and simpler on Mac. Single-line mode only needs to set the parameters of the candidate word area. The principle of parameter setting taking effect is the same as that of double-line skin.

5. `statusbar.ini`: Status bar configuration file. The icons on the status bar can be arranged anywhere on the status bar background image, you only need to set its horizontal and vertical coordinates. All coordinate values are based on the upper left corner.

6. `*.png`: Skin slice file, you can replace the corresponding file with your own slice.

7. `examples`: Example skins, can be downloaded and used directly.

8. `README.md`: Project readme file.

9. `LICENSE`: This project follows the [MIT license](https://github.com/xiyizhou/BaiduIM-Skin/blob/main/LICENSE). You can use, copy, modify, merge, publish, distribute, sublicense, and sell the software and copies of the software, and you can also modify the license terms to appropriate content according to the needs of the program.

## Contribution

If you have any questions, doubts, or suggestions, please feel free to ask.

This set of skins still has the following problems to be solved. Because I do not understand the Baidu Input Method program code, this developer cannot implement it in a short time. If you have a way to implement it, you are welcome to contribute.

- [ ] Perfect status bar and double-line skin.

- [ ] Vertical centering of candidate area font and background color.

- [ ] Can customize the glyph, font size, and color of the candidate word digital serial number to achieve a display effect similar to the Mac built-in input method to highlight candidate words.

- [ ] The current skin format is `.bdskk`, need to switch to the Baidu Mac Input Method default skin format `.bpsm`.

- [ ] Develop iPhone and iPad skins similar to skins that can customize the preferred word background color.
