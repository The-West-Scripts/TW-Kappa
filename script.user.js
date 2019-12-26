// ==UserScript==
// @name            TW Kappa - Chat Enhancements
// @description     Kappa no Kappa BabyRage
// @author          Alin Stefan Olaru - "xShteff"
// @version         0.17
// @match           https://*.the-west.net/game.php*
// @match           https://*.the-west.de/game.php*
// @match           https://*.the-west.pl/game.php*
// @match           https://*.the-west.nl/game.php*
// @match           https://*.the-west.se/game.php*
// @match           https://*.the-west.ro/game.php*
// @match           https://*.the-west.com.pt/game.php*
// @match           https://*.the-west.cz/game.php*
// @match           https://*.the-west.es/game.php*
// @match           https://*.the-west.ru/game.php*
// @match           https://*.the-west.com.br/game.php*
// @match           https://*.the-west.org/game.php*
// @match           https://*.the-west.hu/game.php*
// @match           https://*.the-west.gr/game.php*
// @match           https://*.the-west.dk/game.php*
// @match           https://*.the-west.sk/game.php*
// @match           https://*.the-west.fr/game.php*
// @match           https://*.the-west.it/game.php*
// @downloadURL     https://the-west-scripts.github.io/TW-Kappa/script.user.js
// @updateURL       https://the-west-scripts.github.io/TW-Kappa/script.user.js
// @grant           none
// @run-at          document-end
// ==/UserScript==

/*
  This is absolutely atrocious, I do not approve of it. I've made this 
  UserScript back in 2014, when CORS was not an issue on GitHub.
  Also the original API was deprecated and doesn't work the same way anymore.

  I'm sorry, I hope no recruiter will ever see this monstruousity.
*/

var TWKappa = {
  Settings: {
    image_size: 200,
    video_width: 300,
    video_height: 190
  },
  VersionControl: {
    version: 0.16,
    isOutdated: function() {
      return (
        TWKappa.Emotes.Extra.storage.latestVersion >
        TWKappa.VersionControl.version
      );
    },
    // Gotta find a better way to do this now
    notifyOutdated: function() {
      if (TWKappa.VersionControl.isOutdated()) {
        new west.gui.Dialog(
          "TWKappa is outdated",
          "There's a new version of TWKappa currently available! Do you want to install it?",
          west.gui.Dialog.SYS_WARNING
        )
          .addButton("Install!", function() {
            window.open(
              " https://alstol.github.io/TWKappa/twkappa.user.js",
              "_blank"
            );
          })
          .addButton("Close", function() {})
          .show();
      }
    }
  },
  LocalStorage: {
    key: "twkappa_settings",
    init: function() {
      if (localStorage.getItem(TWKappa.LocalStorage.key) === null)
        TWKappa.LocalStorage.save();
      else {
        var fromLocal = JSON.parse(
          localStorage.getItem(TWKappa.LocalStorage.key)
        );
        for (var key in TWKappa.Settings) {
          if (fromLocal[key] === undefined) {
            TWKappa.LocalStorage.save();
            break;
          }
        }
        TWKappa.LocalStorage.load();
      }
    },
    save: function() {
      localStorage.setItem(
        TWKappa.LocalStorage.key,
        JSON.stringify(TWKappa.Settings)
      );
    },
    load: function() {
      TWKappa.Settings = JSON.parse(
        localStorage.getItem(TWKappa.LocalStorage.key)
      );
    }
  },
  Window: {
    RegisterWestApi: function() {
      var content = $("<div>").text(
        "TWKappa, originally built by xShteff, no longer maintained. If you wish to contribute please contact me on GitHub and I will grant you access."
      );
      TheWestApi.register(
        "TWKappa",
        "TW Twitch Chat Emotes",
        "2.1",
        Game.version.toString(),
        "xShteff",
        "https://github.com/alstol/TWKappa/"
      ).setGui(content);
    },
    Table: {
      buildRow: function(array) {
        var row = $("<tr>");
        for (var i = 0; i < array.length; i++) row.append(array[i]);
        return row;
      },
      buildCell: function(content) {
        return $("<td>").html(content);
      },
      buildRowCell: function(content) {
        return $("<td>")
          .attr("colspan", "2")
          .html(content);
      },
      buildLabel: function(text) {
        return $("<td>")
          .text(text)
          .css({
            "line-height": "30px",
            "font-weight": "bold"
          });
      },
      buildInputTable: function() {
        var table = $("<table>").attr("id", "twkappa_input_table");
        var r1Content = [
          TWKappa.Window.Table.buildLabel("Img max size: "),
          TWKappa.Window.Table.buildCell(
            new west.gui.Textfield("kappa_image_size")
              .setValue(TWKappa.Settings.image_size)
              .setSize(2)
              .onlyNumeric()
              .getMainDiv()
          )
        ];
        var r1 = TWKappa.Window.Table.buildRow(r1Content);

        var rYTWidthContent = [
          TWKappa.Window.Table.buildLabel("YT Height: "),
          TWKappa.Window.Table.buildCell(
            new west.gui.Textfield("kappa_yt_height")
              .setValue(TWKappa.Settings.video_height)
              .setSize(2)
              .onlyNumeric()
              .getMainDiv()
          )
        ];
        var rYTWidth = TWKappa.Window.Table.buildRow(rYTWidthContent);
        var rYTHeightContent = [
          TWKappa.Window.Table.buildLabel("YT Width: "),
          TWKappa.Window.Table.buildCell(
            new west.gui.Textfield("kappa_yt_width")
              .setValue(TWKappa.Settings.video_width)
              .setSize(2)
              .onlyNumeric()
              .getMainDiv()
          )
        ];
        var rYTHeight = TWKappa.Window.Table.buildRow(rYTHeightContent);
        var buttonSave = new west.gui.Button("Save Size", function() {
          var size = $("#kappa_image_size").val();
          TWKappa.Settings.image_size = size;
          TWKappa.Settings.video_height = $("#kappa_yt_height").val();
          TWKappa.Settings.video_width = $("#kappa_yt_width").val();

          new UserMessage("Settings saved!").show();
          TWKappa.LocalStorage.save();
        });

        var buttonEmotes = new west.gui.Button("Toggle emotes", function() {
          $("#tw_kappa_emote_list").toggle();
        });

        var buttonFetchEmotes = new west.gui.Button(
          "Refresh emotes",
          function() {
            TWKappa.Emotes.Twitch.init();
            TWKappa.Emotes.Extra.init();
          }
        );
        var r2 = TWKappa.Window.Table.buildRow([
          TWKappa.Window.Table.buildCell(buttonFetchEmotes.getMainDiv()),
          TWKappa.Window.Table.buildCell(buttonEmotes.getMainDiv())
        ]);
        table
          .append(r1)
          .append(rYTHeight)
          .append(rYTWidth)
          .append(
            TWKappa.Window.Table.buildRow(
              TWKappa.Window.Table.buildRowCell(
                "<i>Setting any of these to 0 will disable the feature</i>"
              )
            )
          )
          .append(
            TWKappa.Window.Table.buildRow(
              TWKappa.Window.Table.buildCell(buttonSave.getMainDiv())
            )
          )
          .append(r2);
        return table;
      },
      buildEmoteTable: function() {
        var table = $("<table>")
          .attr({
            id: "tw_kappa_emote_list",
            border: 1
          })
          .css({
            display: "none",
            "text-align": "center",
            width: "100%"
          });
        var header = $("<tr>");
        header.append(
          TWKappa.Window.Table.buildCell("<b>Image</b>"),
          TWKappa.Window.Table.buildCell("<b>Keyword</b>")
        );
        table.append(header);
        $.each(TWKappa.Emotes.Extra.storage.emotes, function(key, value) {
          var row = $("<tr>");
          var image = $("<img>")
            .attr({
              src: value,
              alt: key,
              title: key,
              class: "twkappa_preview"
            })
            .click(function() {
              var val = $("input.message").val();
              $("input.message").val(val + key + " ");
            });
          row.append(
            TWKappa.Window.Table.buildCell(image),
            TWKappa.Window.Table.buildCell(key)
          );
          table.append(row);
        });
        if (TWKappa.Emotes.Twitch.storage.emotes !== null)
          $.each(TWKappa.Emotes.Twitch.storage, function(key, value) {
            var row = $("<tr>");
            var image = $("<img>")
              .attr({
                src:
                  "https://static-cdn.jtvnw.net/emoticons/v1/" +
                  value.id +
                  "/1.0",
                alt: key,
                title: key,
                class: "twkappa_preview"
              })
              .click(function() {
                var val = $("input.message").val();
                $("input.message").val(val + key + " ");
              });
            row.append(
              TWKappa.Window.Table.buildCell(image),
              TWKappa.Window.Table.buildCell(key)
            );
            table.append(row);
          });
        return table;
      }
    },
    open: function() {
      var content = $("<div>");
      content.append(TWKappa.Window.Table.buildInputTable());
      content.append(TWKappa.Window.Table.buildEmoteTable());
      var contentScroll = new west.gui.Scrollpane().appendContent(content);
      wman
        .open("twkappa", "TWKappa")
        .setMiniTitle("TWKappa")
        .setSize(320, 480)
        .appendToContentPane(contentScroll.getMainDiv());
      $("#twkappa_input_table tr:nth-child(4) td").css(
        "padding-bottom",
        "20px"
      );
    }
  },
  Icon: {
    init: function() {
      var icon = $("<div></div>")
        .attr({
          title: "TWKappa",
          class: "menulink"
        })
        .css({
          background: 'url("http://puu.sh/rQG5v/fee8e31d02.png")',
          "background-position": "0px 0px"
        })
        .mouseleave(function() {
          $(this).css("background-position", "0px 0px");
        })
        .mouseenter(function(e) {
          $(this).css("background-position", "25px 0px");
        })
        .click(function() {
          TWKappa.Window.open();
        });

      var cap = $("<div></div>").attr({
        class: "menucontainer_bottom"
      });

      if ($("#twkappa_init_button").length == 0)
        $("#ui_menubar").append(
          $("<div></div>")
            .attr({
              class: "ui_menucontainer",
              id: "twkappa_init_button"
            })
            .append(icon)
            .append(cap)
        );
    }
  },
  Emotes: {
    Extra: {
      storage: null,
      init: function() {
        TWKappa.Emotes.Extra.storage = emoteData;
        // $.get("https://alstol.github.io/TWKappa/emotes.json", function(data) {
        //   TWKappa.Emotes.Extra.storage = data;
        //   //new UserMessage('Extra Emotes Loaded').show();
        //   TWKappa.VersionControl.notifyOutdated();
        // }).fail(function() {
        //   new UserMessage("Can't load Extra emotes").show();
        // });
      }
    },
    Twitch: {
      storage: null,
      init: function() {
        TWKappa.Emotes.Twitch.storage = twitchData;
        // $.get("https://alstol.github.io/TWKappa/twatchemotes.json", function(
        //   data
        // ) {
        //   TWKappa.Emotes.Twitch.storage = data;
        //   //new UserMessage('Twitch Emotes Loaded').show();
        // }).fail(function() {
        //   new UserMessage("Can't load Twitch emotes").show();
        //   TWKappa.Emotes.Twitch.storage = null;
        // });
      }
    },
    isInit: function() {
      return (
        TWKappa.Emotes.Twitch.storage !== null ||
        TWKappa.Emotes.Extra.storage !== null
      );
    },
    Fix: {
      KappaPride: "55338",
      KappaClaus: "74510",
      KappaWealth: "81997",
      KappaRoss: "70433",
      PeteZarollTie: "81244",
      AMPEnergyCherry: "99265"
    }
  },
  GameInject: {
    parser: function() {
      var oldfunc = Game.TextHandler.parse;
      Game.TextHandler.parse = function(m) {
        //YouTube
        if (
          TWKappa.Settings.video_width > 0 &&
          TWKappa.Settings.video_height > 0
        ) {
          var ytRegex = /^(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?(?:.*?&(?:amp;)?)?v=|\.be\/)([\w\-]+)(?:&(?:amp;)?[\w\?=]*)?$/g;
          var isYT = ytRegex.test(m);
          if (isYT) {
            var ytUrl = ytRegex.exec(m);
            var ytFrame = $("<iframe>").attr({
              width: TWKappa.Settings.video_width,
              height: TWKappa.Settings.video_height,
              src: `https://www.youtube.com/embed/${ytRegex.exec(m)[1]}`,
              frameborder: 0,
              allowfullscreeen: ""
            });
            return ytFrame[0].outerHTML;
          }
        }

        //Images
        if (TWKappa.Settings.image_size > 0) {
          var imgRegex = /^http(|s):\/\/([^\s]*)\.(png|jpg|gif)$/g;
          if (imgRegex.test(m)) {
            var image = $("<img>")
              .attr({
                src: m,
                alt: "Click to enlarge"
              })
              .css({
                "max-width": TWKappa.Settings.image_size + "px",
                "max-height": TWKappa.Settings.image_size + "px"
              });
            return oldfunc(
              "<a href='" +
                m +
                "' target='_blank'>" +
                image[0].outerHTML +
                "</a>"
            );
          }
        }

        //Extra Emotes
        try {
          for (var k in TWKappa.Emotes.Extra.storage.emotes)
            m = m.replace(
              new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"),
              " <img alt='" +
                k +
                "' title='" +
                k +
                "' src='" +
                TWKappa.Emotes.Extra.storage.emotes[k] +
                "' />"
            );
        } catch (error) {
          console.error(`Error with extra emotes: ${error}`);
        }
        //Fix for Kappas
        try {
          for (var k in TWKappa.Emotes.Fix)
            m = m.replace(
              new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"),
              " <img alt='" +
                k +
                "' title='" +
                k +
                "' src='https://static-cdn.jtvnw.net/emoticons/v1/" +
                TWKappa.Emotes.Fix[k] +
                "/1.0' />"
            );
        } catch (error) {
          console.error(`Error with kappa emotes: ${error}`);
        }

        try {
          if (TWKappa.Emotes.Twitch.storage !== null)
            for (var k in TWKappa.Emotes.Twitch.storage)
              m = m.replace(
                new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"),
                " <img alt='" +
                  k +
                  "' title='" +
                  k +
                  "' src='https://static-cdn.jtvnw.net/emoticons/v1/" +
                  TWKappa.Emotes.Twitch.storage[k].id +
                  "/1.0' />"
              );
        } catch (error) {
          console.error(`Error with twatch emotes: ${error}`);
        }

        try {
          if (new Date().getMonth() === 11)
            for (var k in TWKappa.Emotes.Extra.storage.winter)
              m = m.replace(
                new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"),
                " <img alt='" +
                  k +
                  "' title='" +
                  k +
                  "'src='" +
                  TWKappa.Emotes.Extra.storage.winter[k].src +
                  "' style='" +
                  TWKappa.Emotes.Extra.storage.winter[k].style +
                  "' />"
              );
        } catch (error) {
          console.error(`Error with Winter stuff: ${error}`);
        }

        return oldfunc(m);
      };
    }
  },
  init: function() {
    TWKappa.Emotes.Twitch.init();
    TWKappa.Emotes.Extra.init();
    TWKappa.Icon.init();
    TWKappa.LocalStorage.init();
    TWKappa.GameInject.parser();
    TWKappa.Window.RegisterWestApi();
    if (new Date().getMonth() === 11)
      $("head").append(
        "<style>div.tw2gui_window.chat .chat_text { overflow:visible; }</style>"
      );
  }
};

const twitchData = {
  JKanStyle: {
    id: 15,
    code: "JKanStyle",
    emoticon_set: 0,
    description: null
  },
  OptimizePrime: {
    id: 16,
    code: "OptimizePrime",
    emoticon_set: 0,
    description: null
  },
  StoneLightning: {
    id: 17,
    code: "StoneLightning",
    emoticon_set: 0,
    description: null
  },
  TheRinger: {
    id: 18,
    code: "TheRinger",
    emoticon_set: 0,
    description: null
  },
  RedCoat: {
    id: 22,
    code: "RedCoat",
    emoticon_set: 0,
    description: null
  },
  Kappa: {
    id: 25,
    code: "Kappa",
    emoticon_set: 0,
    description: null
  },
  JonCarnage: {
    id: 26,
    code: "JonCarnage",
    emoticon_set: 0,
    description: null
  },
  MrDestructoid: {
    id: 28,
    code: "MrDestructoid",
    emoticon_set: 0,
    description: null
  },
  BCWarrior: {
    id: 30,
    code: "BCWarrior",
    emoticon_set: 0,
    description: null
  },
  GingerPower: {
    id: 32,
    code: "GingerPower",
    emoticon_set: 0,
    description: null
  },
  DansGame: {
    id: 33,
    code: "DansGame",
    emoticon_set: 0,
    description: null
  },
  SwiftRage: {
    id: 34,
    code: "SwiftRage",
    emoticon_set: 0,
    description: null
  },
  PJSalt: {
    id: 36,
    code: "PJSalt",
    emoticon_set: 0,
    description: null
  },
  KevinTurtle: {
    id: 40,
    code: "KevinTurtle",
    emoticon_set: 0,
    description: null
  },
  Kreygasm: {
    id: 41,
    code: "Kreygasm",
    emoticon_set: 0,
    description: null
  },
  SSSsss: {
    id: 46,
    code: "SSSsss",
    emoticon_set: 0,
    description: null
  },
  PunchTrees: {
    id: 47,
    code: "PunchTrees",
    emoticon_set: 0,
    description: null
  },
  FunRun: {
    id: 48,
    code: "FunRun",
    emoticon_set: 0,
    description: null
  },
  ArsonNoSexy: {
    id: 50,
    code: "ArsonNoSexy",
    emoticon_set: 0,
    description: null
  },
  SMOrc: {
    id: 52,
    code: "SMOrc",
    emoticon_set: 0,
    description: null
  },
  FrankerZ: {
    id: 65,
    code: "FrankerZ",
    emoticon_set: 0,
    description: null
  },
  OneHand: {
    id: 66,
    code: "OneHand",
    emoticon_set: 0,
    description: null
  },
  HassanChop: {
    id: 68,
    code: "HassanChop",
    emoticon_set: 0,
    description: null
  },
  BloodTrail: {
    id: 69,
    code: "BloodTrail",
    emoticon_set: 0,
    description: null
  },
  DBstyle: {
    id: 73,
    code: "DBstyle",
    emoticon_set: 0,
    description: null
  },
  AsianGlow: {
    id: 74,
    code: "AsianGlow",
    emoticon_set: 0,
    description: null
  },
  BibleThump: {
    id: 86,
    code: "BibleThump",
    emoticon_set: 0,
    description: null
  },
  ShazBotstix: {
    id: 87,
    code: "ShazBotstix",
    emoticon_set: 0,
    description: null
  },
  PogChamp: {
    id: 88,
    code: "PogChamp",
    emoticon_set: 0,
    description: null
  },
  PMSTwin: {
    id: 92,
    code: "PMSTwin",
    emoticon_set: 0,
    description: null
  },
  FUNgineer: {
    id: 244,
    code: "FUNgineer",
    emoticon_set: 0,
    description: null
  },
  ResidentSleeper: {
    id: 245,
    code: "ResidentSleeper",
    emoticon_set: 0,
    description: null
  },
  "4Head": {
    id: 354,
    code: "4Head",
    emoticon_set: 0,
    description: null
  },
  HotPokket: {
    id: 357,
    code: "HotPokket",
    emoticon_set: 0,
    description: null
  },
  FailFish: {
    id: 360,
    code: "FailFish",
    emoticon_set: 0,
    description: null
  },
  DAESuppy: {
    id: 973,
    code: "DAESuppy",
    emoticon_set: 0,
    description: null
  },
  WholeWheat: {
    id: 1896,
    code: "WholeWheat",
    emoticon_set: 0,
    description: null
  },
  ThunBeast: {
    id: 1898,
    code: "ThunBeast",
    emoticon_set: 0,
    description: null
  },
  TF2John: {
    id: 1899,
    code: "TF2John",
    emoticon_set: 0,
    description: null
  },
  RalpherZ: {
    id: 1900,
    code: "RalpherZ",
    emoticon_set: 0,
    description: null
  },
  Kippa: {
    id: 1901,
    code: "Kippa",
    emoticon_set: 0,
    description: null
  },
  Keepo: {
    id: 1902,
    code: "Keepo",
    emoticon_set: 0,
    description: null
  },
  BigBrother: {
    id: 1904,
    code: "BigBrother",
    emoticon_set: 0,
    description: null
  },
  SoBayed: {
    id: 1906,
    code: "SoBayed",
    emoticon_set: 0,
    description: null
  },
  PeoplesChamp: {
    id: 3412,
    code: "PeoplesChamp",
    emoticon_set: 0,
    description: null
  },
  GrammarKing: {
    id: 3632,
    code: "GrammarKing",
    emoticon_set: 0,
    description: null
  },
  PanicVis: {
    id: 3668,
    code: "PanicVis",
    emoticon_set: 0,
    description: null
  },
  ANELE: {
    id: 3792,
    code: "ANELE",
    emoticon_set: 0,
    description: null
  },
  BrokeBack: {
    id: 4057,
    code: "BrokeBack",
    emoticon_set: 0,
    description: null
  },
  PipeHype: {
    id: 4240,
    code: "PipeHype",
    emoticon_set: 0,
    description: null
  },
  YouWHY: {
    id: 4337,
    code: "YouWHY",
    emoticon_set: 0,
    description: null
  },
  RitzMitz: {
    id: 4338,
    code: "RitzMitz",
    emoticon_set: 0,
    description: null
  },
  EleGiggle: {
    id: 4339,
    code: "EleGiggle",
    emoticon_set: 0,
    description: null
  },
  TheThing: {
    id: 7427,
    code: "TheThing",
    emoticon_set: 0,
    description: null
  },
  HassaanChop: {
    id: 20225,
    code: "HassaanChop",
    emoticon_set: 0,
    description: null
  },
  BabyRage: {
    id: 22639,
    code: "BabyRage",
    emoticon_set: 0,
    description: null
  },
  panicBasket: {
    id: 22998,
    code: "panicBasket",
    emoticon_set: 0,
    description: null
  },
  PermaSmug: {
    id: 27509,
    code: "PermaSmug",
    emoticon_set: 0,
    description: null
  },
  BuddhaBar: {
    id: 27602,
    code: "BuddhaBar",
    emoticon_set: 0,
    description: null
  },
  WutFace: {
    id: 28087,
    code: "WutFace",
    emoticon_set: 0,
    description: null
  },
  PRChase: {
    id: 28328,
    code: "PRChase",
    emoticon_set: 0,
    description: null
  },
  Mau5: {
    id: 30134,
    code: "Mau5",
    emoticon_set: 0,
    description: null
  },
  HeyGuys: {
    id: 30259,
    code: "HeyGuys",
    emoticon_set: 0,
    description: null
  },
  NotATK: {
    id: 34875,
    code: "NotATK",
    emoticon_set: 0,
    description: null
  },
  mcaT: {
    id: 35063,
    code: "mcaT",
    emoticon_set: 0,
    description: null
  },
  TTours: {
    id: 38436,
    code: "TTours",
    emoticon_set: 0,
    description: null
  },
  PraiseIt: {
    id: 38586,
    code: "PraiseIt",
    emoticon_set: 0,
    description: null
  },
  HumbleLife: {
    id: 46881,
    code: "HumbleLife",
    emoticon_set: 0,
    description: null
  },
  CorgiDerp: {
    id: 49106,
    code: "CorgiDerp",
    emoticon_set: 0,
    description: null
  },
  ArgieB8: {
    id: 51838,
    code: "ArgieB8",
    emoticon_set: 0,
    description: null
  },
  ShadyLulu: {
    id: 52492,
    code: "ShadyLulu",
    emoticon_set: 0,
    description: null
  },
  KappaPride: {
    id: 55338,
    code: "KappaPride",
    emoticon_set: 0,
    description: null
  },
  CoolCat: {
    id: 58127,
    code: "CoolCat",
    emoticon_set: 0,
    description: null
  },
  DendiFace: {
    id: 58135,
    code: "DendiFace",
    emoticon_set: 0,
    description: null
  },
  NotLikeThis: {
    id: 58765,
    code: "NotLikeThis",
    emoticon_set: 0,
    description: null
  },
  riPepperonis: {
    id: 62833,
    code: "riPepperonis",
    emoticon_set: 0,
    description: null
  },
  duDudu: {
    id: 62834,
    code: "duDudu",
    emoticon_set: 0,
    description: null
  },
  bleedPurple: {
    id: 62835,
    code: "bleedPurple",
    emoticon_set: 0,
    description: null
  },
  twitchRaid: {
    id: 62836,
    code: "twitchRaid",
    emoticon_set: 0,
    description: null
  },
  SeemsGood: {
    id: 64138,
    code: "SeemsGood",
    emoticon_set: 0,
    description: null
  },
  MingLee: {
    id: 68856,
    code: "MingLee",
    emoticon_set: 0,
    description: null
  },
  KappaRoss: {
    id: 70433,
    code: "KappaRoss",
    emoticon_set: 0,
    description: null
  },
  KappaClaus: {
    id: 74510,
    code: "KappaClaus",
    emoticon_set: 0,
    description: null
  },
  OhMyDog: {
    id: 81103,
    code: "OhMyDog",
    emoticon_set: 0,
    description: null
  },
  OSfrog: {
    id: 81248,
    code: "OSfrog",
    emoticon_set: 0,
    description: null
  },
  OSsloth: {
    id: 81249,
    code: "OSsloth",
    emoticon_set: 0,
    description: null
  },
  OSkomodo: {
    id: 81273,
    code: "OSkomodo",
    emoticon_set: 0,
    description: null
  },
  VoHiYo: {
    id: 81274,
    code: "VoHiYo",
    emoticon_set: 0,
    description: null
  },
  MikeHogu: {
    id: 81636,
    code: "MikeHogu",
    emoticon_set: 0,
    description: null
  },
  KappaWealth: {
    id: 81997,
    code: "KappaWealth",
    emoticon_set: 0,
    description: null
  },
  cmonBruh: {
    id: 84608,
    code: "cmonBruh",
    emoticon_set: 0,
    description: null
  },
  SmoocherZ: {
    id: 89945,
    code: "SmoocherZ",
    emoticon_set: 0,
    description: null
  },
  NomNom: {
    id: 90075,
    code: "NomNom",
    emoticon_set: 0,
    description: null
  },
  StinkyCheese: {
    id: 90076,
    code: "StinkyCheese",
    emoticon_set: 0,
    description: null
  },
  ChefFrank: {
    id: 90129,
    code: "ChefFrank",
    emoticon_set: 0,
    description: null
  },
  BudStar: {
    id: 97856,
    code: "BudStar",
    emoticon_set: 0,
    description: null
  },
  FutureMan: {
    id: 98562,
    code: "FutureMan",
    emoticon_set: 0,
    description: null
  },
  OpieOP: {
    id: 100590,
    code: "OpieOP",
    emoticon_set: 0,
    description: null
  },
  DoritosChip: {
    id: 102242,
    code: "DoritosChip",
    emoticon_set: 0,
    description: null
  },
  PJSugar: {
    id: 102556,
    code: "PJSugar",
    emoticon_set: 0,
    description: null
  },
  VoteYea: {
    id: 106293,
    code: "VoteYea",
    emoticon_set: 0,
    description: null
  },
  VoteNay: {
    id: 106294,
    code: "VoteNay",
    emoticon_set: 0,
    description: null
  },
  RuleFive: {
    id: 107030,
    code: "RuleFive",
    emoticon_set: 0,
    description: null
  },
  DxCat: {
    id: 110734,
    code: "DxCat",
    emoticon_set: 0,
    description: null
  },
  AMPTropPunch: {
    id: 110785,
    code: "AMPTropPunch",
    emoticon_set: 0,
    description: null
  },
  TinyFace: {
    id: 111119,
    code: "TinyFace",
    emoticon_set: 0,
    description: null
  },
  PicoMause: {
    id: 111300,
    code: "PicoMause",
    emoticon_set: 0,
    description: null
  },
  TheTarFu: {
    id: 111351,
    code: "TheTarFu",
    emoticon_set: 0,
    description: null
  },
  DatSheffy: {
    id: 111700,
    code: "DatSheffy",
    emoticon_set: 0,
    description: null
  },
  UnSane: {
    id: 111792,
    code: "UnSane",
    emoticon_set: 0,
    description: null
  },
  copyThis: {
    id: 112288,
    code: "copyThis",
    emoticon_set: 0,
    description: null
  },
  pastaThat: {
    id: 112289,
    code: "pastaThat",
    emoticon_set: 0,
    description: null
  },
  imGlitch: {
    id: 112290,
    code: "imGlitch",
    emoticon_set: 0,
    description: null
  },
  GivePLZ: {
    id: 112291,
    code: "GivePLZ",
    emoticon_set: 0,
    description: null
  },
  TakeNRG: {
    id: 112292,
    code: "TakeNRG",
    emoticon_set: 0,
    description: null
  },
  BlargNaut: {
    id: 114738,
    code: "BlargNaut",
    emoticon_set: 0,
    description: null
  },
  DogFace: {
    id: 114835,
    code: "DogFace",
    emoticon_set: 0,
    description: null
  },
  Jebaited: {
    id: 114836,
    code: "Jebaited",
    emoticon_set: 0,
    description: null
  },
  TooSpicy: {
    id: 114846,
    code: "TooSpicy",
    emoticon_set: 0,
    description: null
  },
  WTRuck: {
    id: 114847,
    code: "WTRuck",
    emoticon_set: 0,
    description: null
  },
  UncleNox: {
    id: 114856,
    code: "UncleNox",
    emoticon_set: 0,
    description: null
  },
  RaccAttack: {
    id: 114870,
    code: "RaccAttack",
    emoticon_set: 0,
    description: null
  },
  StrawBeary: {
    id: 114876,
    code: "StrawBeary",
    emoticon_set: 0,
    description: null
  },
  PrimeMe: {
    id: 115075,
    code: "PrimeMe",
    emoticon_set: 0,
    description: null
  },
  BrainSlug: {
    id: 115233,
    code: "BrainSlug",
    emoticon_set: 0,
    description: null
  },
  BatChest: {
    id: 115234,
    code: "BatChest",
    emoticon_set: 0,
    description: null
  },
  CurseLit: {
    id: 116625,
    code: "CurseLit",
    emoticon_set: 0,
    description: null
  },
  Poooound: {
    id: 117484,
    code: "Poooound",
    emoticon_set: 0,
    description: null
  },
  FreakinStinkin: {
    id: 117701,
    code: "FreakinStinkin",
    emoticon_set: 0,
    description: null
  },
  SuperVinlin: {
    id: 118772,
    code: "SuperVinlin",
    emoticon_set: 0,
    description: null
  },
  TriHard: {
    id: 120232,
    code: "TriHard",
    emoticon_set: 0,
    description: null
  },
  CoolStoryBob: {
    id: 123171,
    code: "CoolStoryBob",
    emoticon_set: 0,
    description: null
  },
  ItsBoshyTime: {
    id: 133468,
    code: "ItsBoshyTime",
    emoticon_set: 0,
    description: null
  },
  KAPOW: {
    id: 133537,
    code: "KAPOW",
    emoticon_set: 0,
    description: null
  },
  YouDontSay: {
    id: 134254,
    code: "YouDontSay",
    emoticon_set: 0,
    description: null
  },
  UWot: {
    id: 134255,
    code: "UWot",
    emoticon_set: 0,
    description: null
  },
  RlyTho: {
    id: 134256,
    code: "RlyTho",
    emoticon_set: 0,
    description: null
  },
  SoonerLater: {
    id: 134472,
    code: "SoonerLater",
    emoticon_set: 0,
    description: null
  },
  PartyTime: {
    id: 135393,
    code: "PartyTime",
    emoticon_set: 0,
    description: null
  },
  NinjaGrumpy: {
    id: 138325,
    code: "NinjaGrumpy",
    emoticon_set: 0,
    description: null
  },
  MVGame: {
    id: 142140,
    code: "MVGame",
    emoticon_set: 0,
    description: null
  },
  TBAngel: {
    id: 143490,
    code: "TBAngel",
    emoticon_set: 0,
    description: null
  },
  TheIlluminati: {
    id: 145315,
    code: "TheIlluminati",
    emoticon_set: 0,
    description: null
  },
  BlessRNG: {
    id: 153556,
    code: "BlessRNG",
    emoticon_set: 0,
    description: null
  },
  MorphinTime: {
    id: 156787,
    code: "MorphinTime",
    emoticon_set: 0,
    description: null
  },
  ThankEgg: {
    id: 160392,
    code: "ThankEgg",
    emoticon_set: 0,
    description: null
  },
  ArigatoNas: {
    id: 160393,
    code: "ArigatoNas",
    emoticon_set: 0,
    description: null
  },
  BegWan: {
    id: 160394,
    code: "BegWan",
    emoticon_set: 0,
    description: null
  },
  BigPhish: {
    id: 160395,
    code: "BigPhish",
    emoticon_set: 0,
    description: null
  },
  InuyoFace: {
    id: 160396,
    code: "InuyoFace",
    emoticon_set: 0,
    description: null
  },
  Kappu: {
    id: 160397,
    code: "Kappu",
    emoticon_set: 0,
    description: null
  },
  KonCha: {
    id: 160400,
    code: "KonCha",
    emoticon_set: 0,
    description: null
  },
  PunOko: {
    id: 160401,
    code: "PunOko",
    emoticon_set: 0,
    description: null
  },
  SabaPing: {
    id: 160402,
    code: "SabaPing",
    emoticon_set: 0,
    description: null
  },
  TearGlove: {
    id: 160403,
    code: "TearGlove",
    emoticon_set: 0,
    description: null
  },
  TehePelo: {
    id: 160404,
    code: "TehePelo",
    emoticon_set: 0,
    description: null
  },
  TwitchLit: {
    id: 166263,
    code: "TwitchLit",
    emoticon_set: 0,
    description: null
  },
  CarlSmile: {
    id: 166266,
    code: "CarlSmile",
    emoticon_set: 0,
    description: null
  },
  CrreamAwk: {
    id: 191313,
    code: "CrreamAwk",
    emoticon_set: 0,
    description: null
  },
  TwitchRPG: {
    id: 191747,
    code: "TwitchRPG",
    emoticon_set: 0,
    description: null
  },
  Squid1: {
    id: 191762,
    code: "Squid1",
    emoticon_set: 0,
    description: null
  },
  Squid2: {
    id: 191763,
    code: "Squid2",
    emoticon_set: 0,
    description: null
  },
  Squid3: {
    id: 191764,
    code: "Squid3",
    emoticon_set: 0,
    description: null
  },
  Squid4: {
    id: 191767,
    code: "Squid4",
    emoticon_set: 0,
    description: null
  },
  TwitchUnity: {
    id: 196892,
    code: "TwitchUnity",
    emoticon_set: 0,
    description: null
  },
  TBCrunchy: {
    id: 200208,
    code: "TBCrunchy",
    emoticon_set: 0,
    description: null
  },
  TBTacoBag: {
    id: 200211,
    code: "TBTacoBag",
    emoticon_set: 0,
    description: null
  },
  TBTacoProps: {
    id: 200212,
    code: "TBTacoProps",
    emoticon_set: 0,
    description: null
  },
  VaultBoy: {
    id: 206490,
    code: "VaultBoy",
    emoticon_set: 0,
    description: null
  },
  QuadDamage: {
    id: 206494,
    code: "QuadDamage",
    emoticon_set: 0,
    description: null
  },
  BJBlazkowicz: {
    id: 206495,
    code: "BJBlazkowicz",
    emoticon_set: 0,
    description: null
  },
  TPcrunchyroll: {
    id: 323914,
    code: "TPcrunchyroll",
    emoticon_set: 0,
    description: null
  },
  EntropyWins: {
    id: 376765,
    code: "EntropyWins",
    emoticon_set: 0,
    description: null
  },
  LUL: {
    id: 425618,
    code: "LUL",
    emoticon_set: 0,
    description: null
  },
  PowerUpR: {
    id: 425671,
    code: "PowerUpR",
    emoticon_set: 0,
    description: null
  },
  PowerUpL: {
    id: 425688,
    code: "PowerUpL",
    emoticon_set: 0,
    description: null
  },
  HSLight: {
    id: 444567,
    code: "HSLight",
    emoticon_set: 0,
    description: null
  },
  HSVoid: {
    id: 444568,
    code: "HSVoid",
    emoticon_set: 0,
    description: null
  },
  HSCheers: {
    id: 444572,
    code: "HSCheers",
    emoticon_set: 0,
    description: null
  },
  HSWP: {
    id: 446979,
    code: "HSWP",
    emoticon_set: 0,
    description: null
  },
  DarkMode: {
    id: 461298,
    code: "DarkMode",
    emoticon_set: 0,
    description: null
  },
  TwitchVotes: {
    id: 479745,
    code: "TwitchVotes",
    emoticon_set: 0,
    description: null
  },
  TPFufun: {
    id: 508650,
    code: "TPFufun",
    emoticon_set: 0,
    description: null
  },
  TotinosRing: {
    id: 508740,
    code: "TotinosRing",
    emoticon_set: 0,
    description: null
  },
  TotinosRecruit: {
    id: 508741,
    code: "TotinosRecruit",
    emoticon_set: 0,
    description: null
  },
  PeteZaroll: {
    id: 508742,
    code: "PeteZaroll",
    emoticon_set: 0,
    description: null
  }
};

const emoteData = {
  emotes: {
    FeelsBadMan: "https://cdn.betterttv.net/emote/566c9fc265dbbdab32ec053b/1x",
    FeelsGoodMan: "https://cdn.betterttv.net/emote/566c9fde65dbbdab32ec053e/1x",
    "(tf)": "https://cdn.betterttv.net/emote/54fa8f1401e468494b85b537/1x",
    OhMyGoodness: "https://cdn.betterttv.net/emote/54fa925e01e468494b85b54d/1x",
    PancakeMix: "https://cdn.betterttv.net/emote/54fa927801e468494b85b54e/1x",
    GabeN: "https://cdn.betterttv.net/emote/54fa90ba01e468494b85b543/1x",
    "(puke)": "https://cdn.betterttv.net/emote/550288fe135896936880fdd4/1x",
    SaltyCorn: "https://cdn.betterttv.net/emote/56901914991f200c34ffa656/1x",
    SourPls: "https://cdn.betterttv.net/emote/566ca38765dbbdab32ec0560/1x",
    ":njub:": "https://puu.sh/nsE95/d8ddb55703.gif",
    MJCorn: "http://cdn.betterttv.net/emote/55af136fa7f4576c661c53e9/1x",
    RareParrot: "http://cdn.betterttv.net/emote/55a24e1294dd94001ee86b39/1x",
    forsPls: "http://cdn.betterttv.net/emote/55e2096ea6fa8b261f81b12a/1x",
    ":clown:": "http://static-cdn.jtvnw.net/emoticons/v1/60378/1.0",
    JKappa: "http://puu.sh/ntIcK/3ea966617d.png",
    dawgPls: "https://cdn.betterttv.net/emote/55a05e85cc07004a41f8b1d7/1x",
    fRope: "https://static-cdn.jtvnw.net/emoticons/v1/89670/1.0",
    fGun: "https://static-cdn.jtvnw.net/emoticons/v1/89650/1.0",
    fKnife: "https://static-cdn.jtvnw.net/emoticons/v1/90377/1.0",
    FeelsOhWait: "https://cdn.betterttv.net/emote/55ab96ce9406e5482db53424/1x",
    LUL: "https://cdn.betterttv.net/emote/567b00c61ddbe1786688a633/1x",
    BanHammer: "https://cdn.betterttv.net/emote/584074e8bec4367f172e2975/1x",
    RickPls: "https://cdn.betterttv.net/emote/56957a4f6bc784fb79bad9d4/1x",
    SaxPls: "https://cdn.betterttv.net/emote/55b9b972c392e3050eca7f1b/1x",
    HorseHead: "https://cdn.betterttv.net/emote/570c801487b8f35a2827215c/1x",
    FeelsLuluMan: "https://puu.sh/y2ggM/2aa4a0d454.png",
    DogeWithIt: "https://cdn.betterttv.net/emote/54faa52f01e468494b85b579/1x",
    haHAA: "https://cdn.betterttv.net/emote/555981336ba1901877765555/1x",
    KKona: "https://cdn.betterttv.net/emote/566ca04265dbbdab32ec054a/1x",
    VapeNation: "https://cdn.betterttv.net/emote/56f5be00d48006ba34f530a4/1x",
    OhGod: "https://cdn.betterttv.net/emote/566ca07965dbbdab32ec0552/1x",
    ForeverAlone: "https://cdn.betterttv.net/emote/54fa909b01e468494b85b542/1x",
    PedoBear: "https://cdn.betterttv.net/emote/54fa928f01e468494b85b54f/1x",
    FeelsFutuMan: "https://cdn.betterttv.net/emote/56a168d0015a54353d244d82/1x",
    FeelsDiggoMan: "https://cdn.frankerfacez.com/emoticon/316137/1",
    FeelsZz1Man: "https://cdn.betterttv.net/emote/562e959ac6035e430db80b3e/1x",
    Hodor: "http://puu.sh/p4DtF/e1507178fe.png",
    FeelsShteffMan: "https://cdn.frankerfacez.com/emoticon/201235/1",
    xShteff: "https://cdn.frankerfacez.com/emoticon/176251/1",
    Shteff: "https://cdn.frankerfacez.com/emoticon/176251/1",
    FeelsJaroMan: "https://cdn.betterttv.net/emote/5655161718d1dbe358624bf4/1x",
    JustDoIt: "https://cdn.betterttv.net/emote/559f4d1cae90d55f200399fa/1x",
    WowPls: "https://cdn.betterttv.net/emote/55c845ecde06d3181ad07b19/1x",
    DrakePls: "https://cdn.betterttv.net/emote/562f79fe3eadc34d2b4f9e07/1x",
    GandalfPls: "https://cdn.betterttv.net/emote/55b9de142c4d51070e45864c/1x",
    WaitWhat: "https://cdn.betterttv.net/emote/55cbeb8f8b9c49ef325bf738/1x",
    SharkPls: "https://cdn.betterttv.net/emote/55a0d49548b62e494160b7dd/1x",
    FeelsIceyMan: "https://cdn.frankerfacez.com/emoticon/349369/1",
    FeelsRainMan: "https://cdn.betterttv.net/emote/57850b9df1bf2c1003a88644/1x",
    Harambe: "https://cdn.betterttv.net/emote/57a2a063ce4fa5ae1ec63270/1x",
    FeelsAmazingMan:
      "https://cdn.betterttv.net/emote/5733ff12e72c3c0814233e20/1x",
    BibleTrump: "https://cdn.betterttv.net/emote/5668b60dafcaf5da4a5805a1/1x",
    FeelsBanMan: "https://cdn.frankerfacez.com/emoticon/201250/1",
    DonaldPls: "https://cdn.betterttv.net/emote/5823a0167df8f1a41d082cf2/1x",
    FeelsWestMan: "https://cdn.betterttv.net/emote/57defac95441dc6a0c997bec/1x",
    FeelsBlueMan: "https://cdn.betterttv.net/emote/57b4f47651067c5243fe1c60/1x",
    FeelsTrumpMan:
      "https://cdn.betterttv.net/emote/57c4270b34df7eab4ca2690c/1x",
    FeelsBirthdayMan:
      "https://cdn.betterttv.net/emote/55b6524154eefd53777b2580/1x",
    Clap: "https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/1x",
    monkaS: "https://cdn.betterttv.net/emote/56e9f494fff3cc5c35e5287e/1x",
    monkaX: "https://cdn.betterttv.net/emote/58e5abdaf3ef4c75c9c6f0f9/1x",
    POGGERS: "https://cdn.frankerfacez.com/emoticon/216820/1"
  },
  winter: {
    IceCold: {
      src: "https://cdn.betterttv.net/emote/5849c9a4f52be01a7ee5f79d/1x",
      style: "margin-left:-33px"
    },
    SantaHat: {
      src: "https://cdn.betterttv.net/emote/58487cc6f52be01a7ee5f205/1x",
      style: "margin-left:-33px;margin-top: -10px"
    },
    SoSnowy: {
      src: "https://cdn.betterttv.net/emote/567b5b520e984428652809b6/1x",
      style: "margin-left:-33px;margin-top: -6px"
    }
  }
};


TWKappa.init();
