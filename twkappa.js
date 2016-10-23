// ==UserScript==
// @name            TW Twitch Emotes
// @description     Kappa
// @author          xShteff
// @version         0.06
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
// @downloadURL     https://xshteff.github.io/userscripts/kappa.user.js
// @updateURL       https://xshteff.github.io/userscripts/kappa.user.js
// @grant           none
// @run-at          document-end
// ==/UserScript==
var version = 0.06;

var twitchEmotes;

var scriptInfo = 'Dank meme list <br>';
window.twkappa = {
    script: TheWestApi.register('TWKappa', 'TW Twitch Chat Emotes', '2.1', Game.version.toString(), 'xShteff', 'https://xshteff.github.io'),
    setGui: function() {
        this.script.setGui(scriptInfo);
    },
    init: function() {
        this.setGui();
    }
};

$.get("https://twitchemotes.com/api_cache/v2/global.json", function(data) {
    twitchEmotes = data;
    for (var k in twitchEmotes.emotes) {
        scriptInfo += "<img alt='" + k + "' title='" + k + "' src='https://static-cdn.jtvnw.net/emoticons/v1/" + twitchEmotes.emotes[k].image_id + "/1.0' />";
    }
});

var addonEmotes;

$.get("https://xshteff.github.io/userscripts/emotes.json", function(data) {
    addonEmotes = data;
    for (var k in addonEmotes.emotes) {
        scriptInfo += "<img alt='" + k + "' title='" + k + "' src='" + addonEmotes.emotes[k] + "' />";
    }
    window.twkappa.init();
});




var isOutdated = function() {
    return addonEmotes.latestVersion > version;
}

var notifyOutdated = function() {
    if (isOutdated()) {
        new west.gui.Dialog('TWKappa is outdated', 'There\'s a new version of TWKappa currently available! Do you want to install it?', west.gui.Dialog.SYS_WARNING).addButton("Install!", function() {
            window.open('https://xshteff.github.io/userscripts/kappa.user.js', '_blank');
        }).addButton("Close", function() {}).show();
    }

}

window.setTimeout(notifyOutdated, 5000);

Game.TextHandler = function() {
    var sm = {
            ":-?/": "sore",
            "=:)": "invader",
            "&gt;:(": "angry",
            ":&#39;(": "cry",
            ":-?)": "smile",
            ":-?D": "grin",
            ":-?(": "frown",
            ";-?)": "smirk",
            ":-?P": "tongue",
            ":-?p": "tongue",
            ":-?o": "ohmy",
            ":-?O": "ohmy",
            ":-?x": "muted",
            ":-?X": "muted",
            ":-?\\|": "silent",
            "&gt;.&lt;": "palm",
            "&gt;_&lt;": "palm",
            "-.-": "nc",
            "o.O": "oo",
            "O.o": "oo",
            "^_?^": "happy",
            "o_O": "oo",
            "O_o": "oo",
            "X.X": "xx",
            "x.x": "xx",
            "X_X": "xx",
            "x_x": "xx",
            "T_T": "cry",
            "T.T": "cry",
            "el pollo diablo!": "elpollodiablo",
            "!el pollo diablo": "elpollodiablo_mirror",
            "el pollo diablo\\?!": "elpollodiablo_front"
        },
        kappas = {
            "KappaPride": "55338",
            "KappaClaus": "74510",
            "KappaWealth": "81997",
            "KappaRoss": "70433",
            "PeteZarollTie": "81244"
        },
        sa = {
            "a+\\W*(d+\\W*)+m+\\W*e+\\W*!+": {
                flags: 'gi',
                text: 'meee',
                src: "sheep_rainbow.gif"
            },
            "a+\\W*(d+\\W*)+m+\\W*e+": {
                flags: 'gi',
                src: "sheep.gif"
            },
            "i+\\W*n+\\W*v+\\W*i+\\W*t+\\W*e+\\W*m+\\W*e+": {
                flags: 'gi',
                src: "sheep.gif"
            }
        };
    return {
        parse: function(m) {
            var keep = [];
            m = m.replace(/\[player\](\{.*?\})\[\/player\]/g, function(a, b) {
                try {
                    b = b.replace(/&#39;/g, "'").replace(/&shy;/g, "").replace(/&quot;/g, '"');
                    b = JSON.parse(b);
                    var c = Chat.Resource.Manager.getClient(b.id);
                    if (c) keep.push(Chat.Formatter.formatClient(c));
                    else keep.push(b.name);
                    return "&&" + (keep.length - 1) + "&&";
                } catch (e) {
                    return a;
                }
            }).replace(/\[report=(.*?)\](.*?)\[\/report\]/g, function(a, b, c) {
                var str = b.escapeHTML();
                if (str.length < 11) return a;
                keep.push("<a class='reportlink' href='javascript:void(parent.ReportWindow.open(" + str.substring(0, str.length - 10) + ",\"" + str.substring(str.length - 10, str.length) + "\"))' >" + c + "</a>");
                return "&&" + (keep.length - 1) + "&&";
            }).replace(/\[item=(.*?)\]/g, function(a, b, c) {
                b = b.replace(/&shy;/g, "");
                var id = parseInt(b);
                if (!id) return a;
                var itm = ItemManager.get(id, true);
                if (!itm) return a;
                keep.push("<a href='javascript:void(0)' class='bbcode itemlink' title='" + (new ItemPopup(itm).getXHTML().escapeHTML()) + "'>[" + (itm.getItemLevel() ? ' <span class="item_level' + (itm.isUpgradeable() ? '' : ' fake') + '">' + itm.getItemLevel() + '</span>' : '') + itm.name.escapeHTML() + "]</a>");
                return "&&" + (keep.length - 1) + "&&";
            }).replace(/(http(s)?:\/\/[^\s<]+)/g, function(a, b, c, d, org) {
                a = a.replace(/&shy;/g, "");
                if (org.match(/<a\s(.*)href=(\'|\")(.*)(\'|\")/)) return a;
                else if (org.match(/<img\s(.*)src=(\'|\")(.*)(\'|\")/)) return a;
                keep.push("<a href='javascript:void(0)' onclick='showlink(\"" + a.escapeHTML() + "\");return false' target='_blank'>" + a + "</a>");
                return "&&" + (keep.length - 1) + "&&";
            }).replace(MarkerUi.importRegExp, function(str, x, y, desc) {
                return "<a href='javascript:void(parent.MarkerUi.importMarker(" + x + "," + y + ",\"" + desc.escapeHTML() + "\"))'>Marker: " + desc + "</a>";
            });
            for (var k in addonEmotes.emotes) {
                m = m.replace(new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"), " <img alt='" + k + "' title='" + k + "' src='" + addonEmotes.emotes[k] + "' />");
            }
            for (var k in kappas) {
                m = m.replace(new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"), " <img alt='" + k + "' title='" + k + "' src='https://static-cdn.jtvnw.net/emoticons/v1/" + kappas[k] + "/1.0' />");
            }
            for (var k in twitchEmotes.emotes) {
                m = m.replace(new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"), " <img alt='" + k + "' title='" + k + "' src='https://static-cdn.jtvnw.net/emoticons/v1/" + twitchEmotes.emotes[k].image_id + "/1.0' />");
            }
            for (var k in sa) {
                m = m.replace(new RegExp("(^|\\s)" + k, (sa[k].flags ? sa[k].flags : "g")), " <img src='//westzzs.innogamescdn.com/images/chat/emoticons/" + sa[k].src + "' /> " + (sa[k].text ? sa[k].text : '') + "");
            }
            for (var k in sm) {
                m = m.replace(new RegExp("(^|\\s)" + k.replace(/([\)\.\^\(])/g, "\\$1"), "g"), " <img src='//westzzs.innogamescdn.com/images/chat/emoticons/" + sm[k] + ".png?1' />");
            }
            if (west && west.events && west.events.Manager) {
                west.common.forEach(west.events.Manager.getRunningEventsCurrencies(), function(obj) {
                    m = m.replace(new RegExp("(^|\\s)" + obj.id + "!", "gi"), ' <span class="bbcode chat_icon icon ' + obj.id + '"></span>');
                });
            }
            return m.replace(/&&(\d+)&&/g, function(_, x) {
                return keep[parseInt(x)];
            });
        }
    };
}();