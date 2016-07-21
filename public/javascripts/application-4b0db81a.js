/*!
 * jQuery JavaScript Library v2.1.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:01Z
 */
function trackEvent(e, t, n) {
    ga("send", {
        hitType: "event",
        eventCategory: e,
        eventAction: t,
        eventLabel: n
    }), analytics.track(n)
}

function identifyUser(e) {
    analytics.identify(e)
}

function getParameterByName(e, t) {
    t || (t = window.location.href), e = e.replace(/[\[\]]/g, "\\$&");
    var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)", "i"),
        i = n.exec(t);
    return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/g, " ")) : "" : null
}

function mainExamples() {
    return [{
        headline: "be more productive",
        messages: ["Hi, I am Pam, your personal assistant, I'll help you fulfill your personal goals", "Are you a robot?", "Yes, and I'll help you be more productive every day.", "Sounds great :)"]
    }, {
        headline: "wake up smoothly",
        messages: ["It's 8am, you asked me to wake you then", "Is it 8 already? &#128542", "Yes, start your personalized morning routine!", "I finished!","Bravo! Here is a reward : <img src=http://www.awesomelycute.com/gallery/2011/11/awesomelycute-video-36.jpg style=width:170px;height:100px>"]
    }, {
        headline: "complete your tasks",
        messages: ["Have you completed your first task?", "Yes, I just finished it!", "Great, don't forget your meeting at 3pm!", "Shoot, I nearly forgot, thank you!"]
    }, {
        headline: "reflect on your day",
        messages: ["Hi, it's 9pm, what are your reflections for the day?", "I finished all my tasks and skydived for the first time!", "Congratulations, you can see all your daily reflections here:<p><u>my-personal-reflections</u></p>"]
    }]
}

function bacExamples() {
    return [{
        headline: "ce que tu veux",
        messages: ["Hi PAM, what do you do?", "Je simplifie et \xe9gaye ton quotidien d'\xe9tudiant en r\xe9pondant \xe0 toutes tes demandes \ud83c\udfe1\ud83c\udf55\ud83c\udf79\ud83c\udf81", "Ok, et t'es un robot, c'est \xe7a ?", "A moiti\xe9 :)\nJe suis une Intelligence Artificielle supervis\xe9e par des humains pour r\xe9pondre aux \xe9tudiants"]
    }, {
        headline: "ton job \xe9tudiant",
        messages: ["Jam j'ai plus une thune \ud83d\ude31 ... J'ai besoin d'un job \xe9tudiant ASAP", "N'importe o\xf9 dans Paris ?", "Oui, n'importe o\xf9", "J'ai beaucoup d'offres pour toi ! Voici la plus r\xe9cente : hij.am/petitjob3e493j"]
    }, {
        headline: "l'appart parfait",
        messages: ["Je galere a trouver un studio proche de l'\xe9cole... Tu peux m'aider ?", "Yes ! Je t'ai d\xe9j\xe0 trouv\xe9 ces 3 offres \ud83c\udfe0 :\n- Marais, 800\u20ac : hij.am/appart8qi21fi8\n- R\xe9publique, 840\u20ac : hij.am/appart4gi2zx2\n- Sentier, 855\u20ac : hij.am/appart9eh8ii1\nN'h\xe9site pas si tu en veux plus !", "Merci Jam t'es un as !"]
    }, {
        headline: "des bars styl\xe9s",
        messages: ["Tu sais ou sortir ce soir pr\xe8s de ma fac ?", "Je te propose Le Panic Room au 101 rue Amelot: hij.am/foo92hqz27", "Merci Jam, je vais tester !", "Ravi de t'avoir aid\xe9. Bois un coup \xe0 ma sant\xe9 \ud83c\udf7b "]
    }]
}

function cleanMessages(e) {
    $(".messages")
        .html('<div class="message"></div>'), $(".messages > .message")
        .replaceWith(_.template('{{ _.forEach(messages, function(message) { }}<div class="message animated">{{= message }}</div>{{ }); }}')({
            messages: examples[e].messages
        })), $(".messages > .message:nth-child(2n)")
        .addClass("to"), $(".messages > .message:nth-child(2n+1)")
        .addClass("from")
}

function showSms(e) {
    setTimeout(function () {
        $(".messages > .message:nth-child(" + (e + 1) + ")")
            .addClass("fadeInUp")
    }, messageTimeoutInterval * e)
}

function changeExample(e) {
    mobileView() ? setTimeout(function () {
        $(".headline .carousel")
            .slick("slickNext")
    }, exampleTimeoutInterval * e) : setTimeout(function () {
        var t = examples[e].messages.length;
        cleanMessages(e);
        for (var n = 0; t > n; n++) showSms(n);
        setTimeout(function () {
            $(".headline .carousel")
                .slick("slickNext")
        }, 4 * exampleTimeoutInterval)
    }, 4 * exampleTimeoutInterval * e)
}

function run() {
    for (var e = 0; e < examples.length; e++) changeExample(e)
}

function carousel() {
    $(".headline .carousel div")
        .replaceWith(_.template("{{ _.forEach(headlines, function(headline) { }}<div>{{= headline }}</div>{{ }); }}")({
            headlines: _.map(examples, "headline")
        })), $(".headline .carousel")
        .slick({
            vertical: !0,
            arrows: !1
        });
    var e = mobileView() ? exampleTimeoutInterval * examples.length : exampleTimeoutInterval * (examples.length * numberOfMessagesByExample);
    setInterval(function () {
        run()
    }, e), run()
}

function showFooterOnScroll() {
    $(window)
        .scroll(function () {
            $(document)
                .scrollTop() > 2 * $(window)
                .height() / 3 ? $(".fixed-footer")
                .addClass("show") : $(".fixed-footer")
                .removeClass("show")
        })
}

function mobileView() {
    return document.documentElement.clientWidth < 991
}

function loadCommunities(e) {
    $(".school")
        .prop("disabled", !0), $(".diploma")
        .prop("disabled", !0);
    var t = $.ajax({
        url: backendUrl + "/communities.json",
        method: "GET",
        dataType: "json",
        data: {
            user: {
                id: e.id,
                authentication_token: e.authentication_token
            }
        }
    });
    t.done(function (e) {
        $(".school")
            .prop("disabled", !1), $(".diploma")
            .prop("disabled", !1), $(".school")
            .select2({
                allowClear: !0,
                placeholder: "Choisis ton Ecole / Universit\xe9",
                data: e.communities.map(function (e) {
                    return {
                        id: e.id,
                        text: e.name
                    }
                })
            }), $(".diploma")
            .select2({
                allowClear: !0,
                placeholder: "Choisis ta formation",
                data: formations
            })
    })
}

function registrationSuccess(e) {
    user = e, trackEvent("Registration", "success", "Success registration"), fbq("track", "CompleteRegistration"), identifyUser(e.id), loadCommunities(e), $("#myModal")
        .modal(), $("form#user_registration_footer")
        .fadeOut("slow", function () {
            $(".registration-success")
                .fadeIn("slow")
        }), $("form#user_registration")
        .fadeOut("slow", function () {
            $(".registration-success")
                .fadeIn("slow")
        })
}

function initializeAnalyticsTracking() {
    var e = !1;
    $(window)
        .on("scroll", function () {
            e || (trackEvent("Scroll", "begin", "Beginning of scrolling"), e = !0), $(window)
                .scrollTop() + $(window)
                .height() == $(document)
                .height() && trackEvent("Scroll", "bottom", "Scroll to bottom")
        }), $("form#user_registration .user_phone")
        .on("focus", function () {
            trackEvent("Focus", "main_form", "Focus on main input")
        }), $("form#extra_informations .school")
        .on("select2:open", function () {
            trackEvent("Focus", "extra_informations_form", "Focus on school input")
        }), $("form#extra_informations .diploma")
        .on("select2:open", function () {
            trackEvent("Focus", "extra_informations_form", "Focus on diploma input")
        }), $("#main-cta")
        .on("click", function () {
            trackEvent("Click", "main-cta", "Mobile: click on main cta to registration")
        }), $("form#user_registration_footer .user_phone")
        .on("focus", function () {
            trackEvent("Focus", "footer_form", "Focus on footer input")
        })
}

function arrowClickScroll() {
    $(".arrow")
        .on("click", function () {
            $("body")
                .animate({
                    scrollTop: $(".how")
                        .offset()
                        .top
                }, "slow")
        })
}

function onUserRegistration(e) {
    e.preventDefault();
    var t = $(this),
        n = t.find(".user_phone")
        .val();
    if (n) {
        $("[data-submit]")
            .attr("disabled", "disabled");
        var i = $.ajax({
            url: backendUrl + "/registrations.json",
            method: "POST",
            dataType: "json",
            data: {
                user: {
                    phone: t.find(".user_phone")
                        .val()
                },
                referrer_id: t.find(".referrer_id")
                    .val()
            }
        });
        trackEvent("Registration", "perform", "Perform a registration"), i.done(registrationSuccess), i.fail(function (e, t) {
            trackEvent("Registration", "fail", "Fail registration"), alert("Oops, quelque chose s'est mal pass\xe9, essaye d'envoyer HELLO au 06.44.63.04.04 !")
        }), i.always(function () {
            $("[data-submit]")
                .attr("disabled", null)
        })
    }
}

function setPhoneNumber(e) {
    var t = e.replace(/^33/, "0"),
        n = t.replace(/(.{2})/g, "$1.")
        .replace(/\.$/, "");
    $("[data-sms]")
        .each(function (e) {
            /iPhone|iPad|iPod/i.test(navigator.userAgent) ? $(this)
                .attr("href", "sms:" + t + "&body=" + $(this)
                    .attr("data-sms")) : $(this)
                .attr("href", "sms:" + t + "?body=" + $(this)
                    .attr("data-sms"))
        }), $("[data-phone]")
        .text(n)
}

function initializeReferrer(e) {
    var t = e || getParameterByName("r");
    if (t) {
        $("input.referrer_id")
            .val(t);
        var n = $.ajax({
            url: backendUrl + "/referrers/" + t + ".json",
            method: "GET",
            dataType: "json"
        });
        n.done(function (e) {
            setPhoneNumber(e.phoneNumber)
        })
    } else setPhoneNumber("33644630404")
}! function (e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
    function n(e) {
        var t = "length" in e && e.length,
            n = Z.type(e);
        return "function" === n || Z.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }

    function i(e, t, n) {
        if (Z.isFunction(t)) return Z.grep(e, function (e, i) {
            return !!t.call(e, i, e) !== n
        });
        if (t.nodeType) return Z.grep(e, function (e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (ae.test(t)) return Z.filter(t, e, n);
            t = Z.filter(t, e)
        }
        return Z.grep(e, function (e) {
            return V.call(t, e) >= 0 !== n
        })
    }

    function r(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }

    function o(e) {
        var t = he[e] = {};
        return Z.each(e.match(fe) || [], function (e, n) {
            t[n] = !0
        }), t
    }

    function s() {
        K.removeEventListener("DOMContentLoaded", s, !1), e.removeEventListener("load", s, !1), Z.ready()
    }

    function a() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function () {
                return {}
            }
        }), this.expando = Z.expando + a.uid++
    }

    function l(e, t, n) {
        var i;
        if (void 0 === n && 1 === e.nodeType)
            if (i = "data-" + t.replace(we, "-$1")
                .toLowerCase(), n = e.getAttribute(i), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : be.test(n) ? Z.parseJSON(n) : n
                } catch (r) {}
                ye.set(e, t, n)
            } else n = void 0;
        return n
    }

    function c() {
        return !0
    }

    function u() {
        return !1
    }

    function d() {
        try {
            return K.activeElement
        } catch (e) {}
    }

    function p(e, t) {
        return Z.nodeName(e, "table") && Z.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function f(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function h(e) {
        var t = Le.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function g(e, t) {
        for (var n = 0, i = e.length; i > n; n++) me.set(e[n], "globalEval", !t || me.get(t[n], "globalEval"))
    }

    function v(e, t) {
        var n, i, r, o, s, a, l, c;
        if (1 === t.nodeType) {
            if (me.hasData(e) && (o = me.access(e), s = me.set(t, o), c = o.events)) {
                delete s.handle, s.events = {};
                for (r in c)
                    for (n = 0, i = c[r].length; i > n; n++) Z.event.add(t, r, c[r][n])
            }
            ye.hasData(e) && (a = ye.access(e), l = Z.extend({}, a), ye.set(t, l))
        }
    }

    function m(e, t) {
        var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return void 0 === t || t && Z.nodeName(e, t) ? Z.merge([e], n) : n
    }

    function y(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && ke.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
    }

    function b(t, n) {
        var i, r = Z(n.createElement(t))
            .appendTo(n.body),
            o = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(r[0])) ? i.display : Z.css(r[0], "display");
        return r.detach(), o
    }

    function w(e) {
        var t = K,
            n = He[e];
        return n || (n = b(e, t), "none" !== n && n || (Me = (Me || Z("<iframe frameborder='0' width='0' height='0'/>"))
            .appendTo(t.documentElement), t = Me[0].contentDocument, t.write(), t.close(), n = b(e, t), Me.detach()), He[e] = n), n
    }

    function x(e, t, n) {
        var i, r, o, s, a = e.style;
        return n = n || Ue(e), n && (s = n.getPropertyValue(t) || n[t]), n && ("" !== s || Z.contains(e.ownerDocument, e) || (s = Z.style(e, t)), ze.test(s) && Fe.test(t) && (i = a.width, r = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = r, a.maxWidth = o)), void 0 !== s ? s + "" : s
    }

    function _(e, t) {
        return {
            get: function () {
                return e() ? void delete this.get : (this.get = t)
                    .apply(this, arguments)
            }
        }
    }

    function $(e, t) {
        if (t in e) return t;
        for (var n = t[0].toUpperCase() + t.slice(1), i = t, r = Xe.length; r--;)
            if (t = Xe[r] + n, t in e) return t;
        return i
    }

    function k(e, t, n) {
        var i = Be.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }

    function T(e, t, n, i, r) {
        for (var o = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; 4 > o; o += 2) "margin" === n && (s += Z.css(e, n + _e[o], !0, r)), i ? ("content" === n && (s -= Z.css(e, "padding" + _e[o], !0, r)), "margin" !== n && (s -= Z.css(e, "border" + _e[o] + "Width", !0, r))) : (s += Z.css(e, "padding" + _e[o], !0, r), "padding" !== n && (s += Z.css(e, "border" + _e[o] + "Width", !0, r)));
        return s
    }

    function C(e, t, n) {
        var i = !0,
            r = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = Ue(e),
            s = "border-box" === Z.css(e, "boxSizing", !1, o);
        if (0 >= r || null == r) {
            if (r = x(e, t, o), (0 > r || null == r) && (r = e.style[t]), ze.test(r)) return r;
            i = s && (G.boxSizingReliable() || r === e.style[t]), r = parseFloat(r) || 0
        }
        return r + T(e, t, n || (s ? "border" : "content"), i, o) + "px"
    }

    function S(e, t) {
        for (var n, i, r, o = [], s = 0, a = e.length; a > s; s++) i = e[s], i.style && (o[s] = me.get(i, "olddisplay"), n = i.style.display, t ? (o[s] || "none" !== n || (i.style.display = ""), "" === i.style.display && $e(i) && (o[s] = me.access(i, "olddisplay", w(i.nodeName)))) : (r = $e(i), "none" === n && r || me.set(i, "olddisplay", r ? n : Z.css(i, "display"))));
        for (s = 0; a > s; s++) i = e[s], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? o[s] || "" : "none"));
        return e
    }

    function A(e, t, n, i, r) {
        return new A.prototype.init(e, t, n, i, r)
    }

    function E() {
        return setTimeout(function () {
            Ge = void 0
        }), Ge = Z.now()
    }

    function j(e, t) {
        var n, i = 0,
            r = {
                height: e
            };
        for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = _e[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function O(e, t, n) {
        for (var i, r = (nt[t] || [])
                .concat(nt["*"]), o = 0, s = r.length; s > o; o++)
            if (i = r[o].call(n, t, e)) return i
    }

    function D(e, t, n) {
        var i, r, o, s, a, l, c, u, d = this,
            p = {},
            f = e.style,
            h = e.nodeType && $e(e),
            g = me.get(e, "fxshow");
        n.queue || (a = Z._queueHooks(e, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function () {
            a.unqueued || l()
        }), a.unqueued++, d.always(function () {
            d.always(function () {
                a.unqueued--, Z.queue(e, "fx")
                    .length || a.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], c = Z.css(e, "display"), u = "none" === c ? me.get(e, "olddisplay") || w(e.nodeName) : c, "inline" === u && "none" === Z.css(e, "float") && (f.display = "inline-block")), n.overflow && (f.overflow = "hidden", d.always(function () {
            f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
        }));
        for (i in t)
            if (r = t[i], Qe.exec(r)) {
                if (delete t[i], o = o || "toggle" === r, r === (h ? "hide" : "show")) {
                    if ("show" !== r || !g || void 0 === g[i]) continue;
                    h = !0
                }
                p[i] = g && g[i] || Z.style(e, i)
            } else c = void 0;
        if (Z.isEmptyObject(p)) "inline" === ("none" === c ? w(e.nodeName) : c) && (f.display = c);
        else {
            g ? "hidden" in g && (h = g.hidden) : g = me.access(e, "fxshow", {}), o && (g.hidden = !h), h ? Z(e)
                .show() : d.done(function () {
                    Z(e)
                        .hide()
                }), d.done(function () {
                    var t;
                    me.remove(e, "fxshow");
                    for (t in p) Z.style(e, t, p[t])
                });
            for (i in p) s = O(h ? g[i] : 0, i, d), i in g || (g[i] = s.start, h && (s.end = s.start, s.start = "width" === i || "height" === i ? 1 : 0))
        }
    }

    function N(e, t) {
        var n, i, r, o, s;
        for (n in e)
            if (i = Z.camelCase(n), r = t[i], o = e[n], Z.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), s = Z.cssHooks[i], s && "expand" in s) {
                o = s.expand(o), delete e[i];
                for (n in o) n in e || (e[n] = o[n], t[n] = r)
            } else t[i] = r
    }

    function I(e, t, n) {
        var i, r, o = 0,
            s = tt.length,
            a = Z.Deferred()
            .always(function () {
                delete l.elem
            }),
            l = function () {
                if (r) return !1;
                for (var t = Ge || E(), n = Math.max(0, c.startTime + c.duration - t), i = n / c.duration || 0, o = 1 - i, s = 0, l = c.tweens.length; l > s; s++) c.tweens[s].run(o);
                return a.notifyWith(e, [c, o, n]), 1 > o && l ? n : (a.resolveWith(e, [c]), !1)
            },
            c = a.promise({
                elem: e,
                props: Z.extend({}, t),
                opts: Z.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: Ge || E(),
                duration: n.duration,
                tweens: [],
                createTween: function (t, n) {
                    var i = Z.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(i), i
                },
                stop: function (t) {
                    var n = 0,
                        i = t ? c.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; i > n; n++) c.tweens[n].run(1);
                    return t ? a.resolveWith(e, [c, t]) : a.rejectWith(e, [c, t]), this
                }
            }),
            u = c.props;
        for (N(u, c.opts.specialEasing); s > o; o++)
            if (i = tt[o].call(c, e, u, c.opts)) return i;
        return Z.map(u, O, c), Z.isFunction(c.opts.start) && c.opts.start.call(e, c), Z.fx.timer(Z.extend(l, {
                elem: e,
                anim: c,
                queue: c.opts.queue
            })), c.progress(c.opts.progress)
            .done(c.opts.done, c.opts.complete)
            .fail(c.opts.fail)
            .always(c.opts.always)
    }

    function P(e) {
        return function (t, n) {
            "string" != typeof t && (n = t, t = "*");
            var i, r = 0,
                o = t.toLowerCase()
                .match(fe) || [];
            if (Z.isFunction(n))
                for (; i = o[r++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || [])
                        .unshift(n)) : (e[i] = e[i] || [])
                    .push(n)
        }
    }

    function L(e, t, n, i) {
        function r(a) {
            var l;
            return o[a] = !0, Z.each(e[a] || [], function (e, a) {
                var c = a(t, n, i);
                return "string" != typeof c || s || o[c] ? s ? !(l = c) : void 0 : (t.dataTypes.unshift(c), r(c), !1)
            }), l
        }
        var o = {},
            s = e === bt;
        return r(t.dataTypes[0]) || !o["*"] && r("*")
    }

    function R(e, t) {
        var n, i, r = Z.ajaxSettings.flatOptions || {};
        for (n in t) void 0 !== t[n] && ((r[n] ? e : i || (i = {}))[n] = t[n]);
        return i && Z.extend(!0, e, i), e
    }

    function q(e, t, n) {
        for (var i, r, o, s, a = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i)
            for (r in a)
                if (a[r] && a[r].test(i)) {
                    l.unshift(r);
                    break
                }
        if (l[0] in n) o = l[0];
        else {
            for (r in n) {
                if (!l[0] || e.converters[r + " " + l[0]]) {
                    o = r;
                    break
                }
                s || (s = r)
            }
            o = o || s
        }
        return o ? (o !== l[0] && l.unshift(o), n[o]) : void 0
    }

    function M(e, t, n, i) {
        var r, o, s, a, l, c = {},
            u = e.dataTypes.slice();
        if (u[1])
            for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
        for (o = u.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = u.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
            if (s = c[l + " " + o] || c["* " + o], !s)
                for (r in c)
                    if (a = r.split(" "), a[1] === o && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                        s === !0 ? s = c[r] : c[r] !== !0 && (o = a[0], u.unshift(a[1]));
                        break
                    }
            if (s !== !0)
                if (s && e["throws"]) t = s(t);
                else try {
                    t = s(t)
                } catch (d) {
                    return {
                        state: "parsererror",
                        error: s ? d : "No conversion from " + l + " to " + o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }

    function H(e, t, n, i) {
        var r;
        if (Z.isArray(t)) Z.each(t, function (t, r) {
            n || kt.test(e) ? i(e, r) : H(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, i)
        });
        else if (n || "object" !== Z.type(t)) i(e, t);
        else
            for (r in t) H(e + "[" + r + "]", t[r], n, i)
    }

    function F(e) {
        return Z.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
    }
    var z = [],
        U = z.slice,
        W = z.concat,
        B = z.push,
        V = z.indexOf,
        J = {},
        Y = J.toString,
        X = J.hasOwnProperty,
        G = {},
        K = e.document,
        Q = "2.1.4",
        Z = function (e, t) {
            return new Z.fn.init(e, t)
        },
        ee = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        te = /^-ms-/,
        ne = /-([\da-z])/gi,
        ie = function (e, t) {
            return t.toUpperCase()
        };
    Z.fn = Z.prototype = {
        jquery: Q,
        constructor: Z,
        selector: "",
        length: 0,
        toArray: function () {
            return U.call(this)
        },
        get: function (e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : U.call(this)
        },
        pushStack: function (e) {
            var t = Z.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function (e, t) {
            return Z.each(this, e, t)
        },
        map: function (e) {
            return this.pushStack(Z.map(this, function (t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function () {
            return this.pushStack(U.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor(null)
        },
        push: B,
        sort: z.sort,
        splice: z.splice
    }, Z.extend = Z.fn.extend = function () {
        var e, t, n, i, r, o, s = arguments[0] || {},
            a = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof s && (c = s, s = arguments[a] || {}, a++), "object" == typeof s || Z.isFunction(s) || (s = {}), a === l && (s = this, a--); l > a; a++)
            if (null != (e = arguments[a]))
                for (t in e) n = s[t], i = e[t], s !== i && (c && i && (Z.isPlainObject(i) || (r = Z.isArray(i))) ? (r ? (r = !1, o = n && Z.isArray(n) ? n : []) : o = n && Z.isPlainObject(n) ? n : {}, s[t] = Z.extend(c, o, i)) : void 0 !== i && (s[t] = i));
        return s
    }, Z.extend({
        expando: "jQuery" + (Q + Math.random())
            .replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
            throw new Error(e)
        },
        noop: function () {},
        isFunction: function (e) {
            return "function" === Z.type(e)
        },
        isArray: Array.isArray,
        isWindow: function (e) {
            return null != e && e === e.window
        },
        isNumeric: function (e) {
            return !Z.isArray(e) && e - parseFloat(e) + 1 >= 0
        },
        isPlainObject: function (e) {
            return "object" !== Z.type(e) || e.nodeType || Z.isWindow(e) ? !1 : e.constructor && !X.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
        },
        isEmptyObject: function (e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        type: function (e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? J[Y.call(e)] || "object" : typeof e
        },
        globalEval: function (e) {
            var t, n = eval;
            e = Z.trim(e), e && (1 === e.indexOf("use strict") ? (t = K.createElement("script"), t.text = e, K.head.appendChild(t)
                .parentNode.removeChild(t)) : n(e))
        },
        camelCase: function (e) {
            return e.replace(te, "ms-")
                .replace(ne, ie)
        },
        nodeName: function (e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function (e, t, i) {
            var r, o = 0,
                s = e.length,
                a = n(e);
            if (i) {
                if (a)
                    for (; s > o && (r = t.apply(e[o], i), r !== !1); o++);
                else
                    for (o in e)
                        if (r = t.apply(e[o], i), r === !1) break
            } else if (a)
                for (; s > o && (r = t.call(e[o], o, e[o]), r !== !1); o++);
            else
                for (o in e)
                    if (r = t.call(e[o], o, e[o]), r === !1) break; return e
        },
        trim: function (e) {
            return null == e ? "" : (e + "")
                .replace(ee, "")
        },
        makeArray: function (e, t) {
            var i = t || [];
            return null != e && (n(Object(e)) ? Z.merge(i, "string" == typeof e ? [e] : e) : B.call(i, e)), i
        },
        inArray: function (e, t, n) {
            return null == t ? -1 : V.call(t, e, n)
        },
        merge: function (e, t) {
            for (var n = +t.length, i = 0, r = e.length; n > i; i++) e[r++] = t[i];
            return e.length = r, e
        },
        grep: function (e, t, n) {
            for (var i, r = [], o = 0, s = e.length, a = !n; s > o; o++) i = !t(e[o], o), i !== a && r.push(e[o]);
            return r
        },
        map: function (e, t, i) {
            var r, o = 0,
                s = e.length,
                a = n(e),
                l = [];
            if (a)
                for (; s > o; o++) r = t(e[o], o, i), null != r && l.push(r);
            else
                for (o in e) r = t(e[o], o, i), null != r && l.push(r);
            return W.apply([], l)
        },
        guid: 1,
        proxy: function (e, t) {
            var n, i, r;
            return "string" == typeof t && (n = e[t], t = e, e = n), Z.isFunction(e) ? (i = U.call(arguments, 2), r = function () {
                return e.apply(t || this, i.concat(U.call(arguments)))
            }, r.guid = e.guid = e.guid || Z.guid++, r) : void 0
        },
        now: Date.now,
        support: G
    }), Z.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
        J["[object " + t + "]"] = t.toLowerCase()
    });
    var re =
        /*!
         * Sizzle CSS Selector Engine v2.2.0-pre
         * http://sizzlejs.com/
         *
         * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
         * Released under the MIT license
         * http://jquery.org/license
         *
         * Date: 2014-12-16
         */
        function (e) {
            function t(e, t, n, i) {
                var r, o, s, a, l, c, d, f, h, g;
                if ((t ? t.ownerDocument || t : H) !== D && O(t), t = t || D, n = n || [], a = t.nodeType, "string" != typeof e || !e || 1 !== a && 9 !== a && 11 !== a) return n;
                if (!i && I) {
                    if (11 !== a && (r = ye.exec(e)))
                        if (s = r[1]) {
                            if (9 === a) {
                                if (o = t.getElementById(s), !o || !o.parentNode) return n;
                                if (o.id === s) return n.push(o), n
                            } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(s)) && q(t, o) && o.id === s) return n.push(o), n
                        } else {
                            if (r[2]) return Q.apply(n, t.getElementsByTagName(e)), n;
                            if ((s = r[3]) && x.getElementsByClassName) return Q.apply(n, t.getElementsByClassName(s)), n
                        }
                    if (x.qsa && (!P || !P.test(e))) {
                        if (f = d = M, h = t, g = 1 !== a && e, 1 === a && "object" !== t.nodeName.toLowerCase()) {
                            for (c = T(e), (d = t.getAttribute("id")) ? f = d.replace(we, "\\$&") : t.setAttribute("id", f), f = "[id='" + f + "'] ", l = c.length; l--;) c[l] = f + p(c[l]);
                            h = be.test(e) && u(t.parentNode) || t, g = c.join(",")
                        }
                        if (g) try {
                            return Q.apply(n, h.querySelectorAll(g)), n
                        } catch (v) {} finally {
                            d || t.removeAttribute("id")
                        }
                    }
                }
                return S(e.replace(le, "$1"), t, n, i)
            }

            function n() {
                function e(n, i) {
                    return t.push(n + " ") > _.cacheLength && delete e[t.shift()], e[n + " "] = i
                }
                var t = [];
                return e
            }

            function i(e) {
                return e[M] = !0, e
            }

            function r(e) {
                var t = D.createElement("div");
                try {
                    return !!e(t)
                } catch (n) {
                    return !1
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null
                }
            }

            function o(e, t) {
                for (var n = e.split("|"), i = e.length; i--;) _.attrHandle[n[i]] = t
            }

            function s(e, t) {
                var n = t && e,
                    i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || J) - (~e.sourceIndex || J);
                if (i) return i;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === t) return -1;
                return e ? 1 : -1
            }

            function a(e) {
                return function (t) {
                    var n = t.nodeName.toLowerCase();
                    return "input" === n && t.type === e
                }
            }

            function l(e) {
                return function (t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e
                }
            }

            function c(e) {
                return i(function (t) {
                    return t = +t, i(function (n, i) {
                        for (var r, o = e([], n.length, t), s = o.length; s--;) n[r = o[s]] && (n[r] = !(i[r] = n[r]))
                    })
                })
            }

            function u(e) {
                return e && "undefined" != typeof e.getElementsByTagName && e
            }

            function d() {}

            function p(e) {
                for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
                return i
            }

            function f(e, t, n) {
                var i = t.dir,
                    r = n && "parentNode" === i,
                    o = z++;
                return t.first ? function (t, n, o) {
                    for (; t = t[i];)
                        if (1 === t.nodeType || r) return e(t, n, o)
                } : function (t, n, s) {
                    var a, l, c = [F, o];
                    if (s) {
                        for (; t = t[i];)
                            if ((1 === t.nodeType || r) && e(t, n, s)) return !0
                    } else
                        for (; t = t[i];)
                            if (1 === t.nodeType || r) {
                                if (l = t[M] || (t[M] = {}), (a = l[i]) && a[0] === F && a[1] === o) return c[2] = a[2];
                                if (l[i] = c, c[2] = e(t, n, s)) return !0
                            }
                }
            }

            function h(e) {
                return e.length > 1 ? function (t, n, i) {
                    for (var r = e.length; r--;)
                        if (!e[r](t, n, i)) return !1;
                    return !0
                } : e[0]
            }

            function g(e, n, i) {
                for (var r = 0, o = n.length; o > r; r++) t(e, n[r], i);
                return i
            }

            function v(e, t, n, i, r) {
                for (var o, s = [], a = 0, l = e.length, c = null != t; l > a; a++)(o = e[a]) && (!n || n(o, i, r)) && (s.push(o), c && t.push(a));
                return s
            }

            function m(e, t, n, r, o, s) {
                return r && !r[M] && (r = m(r)), o && !o[M] && (o = m(o, s)), i(function (i, s, a, l) {
                    var c, u, d, p = [],
                        f = [],
                        h = s.length,
                        m = i || g(t || "*", a.nodeType ? [a] : a, []),
                        y = !e || !i && t ? m : v(m, p, e, a, l),
                        b = n ? o || (i ? e : h || r) ? [] : s : y;
                    if (n && n(y, b, a, l), r)
                        for (c = v(b, f), r(c, [], a, l), u = c.length; u--;)(d = c[u]) && (b[f[u]] = !(y[f[u]] = d));
                    if (i) {
                        if (o || e) {
                            if (o) {
                                for (c = [], u = b.length; u--;)(d = b[u]) && c.push(y[u] = d);
                                o(null, b = [], c, l)
                            }
                            for (u = b.length; u--;)(d = b[u]) && (c = o ? ee(i, d) : p[u]) > -1 && (i[c] = !(s[c] = d))
                        }
                    } else b = v(b === s ? b.splice(h, b.length) : b), o ? o(null, s, b, l) : Q.apply(s, b)
                })
            }

            function y(e) {
                for (var t, n, i, r = e.length, o = _.relative[e[0].type], s = o || _.relative[" "], a = o ? 1 : 0, l = f(function (e) {
                        return e === t
                    }, s, !0), c = f(function (e) {
                        return ee(t, e) > -1
                    }, s, !0), u = [function (e, n, i) {
                        var r = !o && (i || n !== A) || ((t = n)
                            .nodeType ? l(e, n, i) : c(e, n, i));
                        return t = null, r
                    }]; r > a; a++)
                    if (n = _.relative[e[a].type]) u = [f(h(u), n)];
                    else {
                        if (n = _.filter[e[a].type].apply(null, e[a].matches), n[M]) {
                            for (i = ++a; r > i && !_.relative[e[i].type]; i++);
                            return m(a > 1 && h(u), a > 1 && p(e.slice(0, a - 1)
                                    .concat({
                                        value: " " === e[a - 2].type ? "*" : ""
                                    }))
                                .replace(le, "$1"), n, i > a && y(e.slice(a, i)), r > i && y(e = e.slice(i)), r > i && p(e))
                        }
                        u.push(n)
                    }
                return h(u)
            }

            function b(e, n) {
                var r = n.length > 0,
                    o = e.length > 0,
                    s = function (i, s, a, l, c) {
                        var u, d, p, f = 0,
                            h = "0",
                            g = i && [],
                            m = [],
                            y = A,
                            b = i || o && _.find.TAG("*", c),
                            w = F += null == y ? 1 : Math.random() || .1,
                            x = b.length;
                        for (c && (A = s !== D && s); h !== x && null != (u = b[h]); h++) {
                            if (o && u) {
                                for (d = 0; p = e[d++];)
                                    if (p(u, s, a)) {
                                        l.push(u);
                                        break
                                    }
                                c && (F = w)
                            }
                            r && ((u = !p && u) && f--, i && g.push(u))
                        }
                        if (f += h, r && h !== f) {
                            for (d = 0; p = n[d++];) p(g, m, s, a);
                            if (i) {
                                if (f > 0)
                                    for (; h--;) g[h] || m[h] || (m[h] = G.call(l));
                                m = v(m)
                            }
                            Q.apply(l, m), c && !i && m.length > 0 && f + n.length > 1 && t.uniqueSort(l)
                        }
                        return c && (F = w, A = y), g
                    };
                return r ? i(s) : s
            }
            var w, x, _, $, k, T, C, S, A, E, j, O, D, N, I, P, L, R, q, M = "sizzle" + 1 * new Date,
                H = e.document,
                F = 0,
                z = 0,
                U = n(),
                W = n(),
                B = n(),
                V = function (e, t) {
                    return e === t && (j = !0), 0
                },
                J = 1 << 31,
                Y = {}.hasOwnProperty,
                X = [],
                G = X.pop,
                K = X.push,
                Q = X.push,
                Z = X.slice,
                ee = function (e, t) {
                    for (var n = 0, i = e.length; i > n; n++)
                        if (e[n] === t) return n;
                    return -1
                },
                te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                ne = "[\\x20\\t\\r\\n\\f]",
                ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                re = ie.replace("w", "w#"),
                oe = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + re + "))|)" + ne + "*\\]",
                se = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)",
                ae = new RegExp(ne + "+", "g"),
                le = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
                ce = new RegExp("^" + ne + "*," + ne + "*"),
                ue = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
                de = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
                pe = new RegExp(se),
                fe = new RegExp("^" + re + "$"),
                he = {
                    ID: new RegExp("^#(" + ie + ")"),
                    CLASS: new RegExp("^\\.(" + ie + ")"),
                    TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + oe),
                    PSEUDO: new RegExp("^" + se),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + te + ")$", "i"),
                    needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
                },
                ge = /^(?:input|select|textarea|button)$/i,
                ve = /^h\d$/i,
                me = /^[^{]+\{\s*\[native \w/,
                ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                be = /[+~]/,
                we = /'|\\/g,
                xe = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
                _e = function (e, t, n) {
                    var i = "0x" + t - 65536;
                    return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
                },
                $e = function () {
                    O()
                };
            try {
                Q.apply(X = Z.call(H.childNodes), H.childNodes), X[H.childNodes.length].nodeType
            } catch (ke) {
                Q = {
                    apply: X.length ? function (e, t) {
                        K.apply(e, Z.call(t))
                    } : function (e, t) {
                        for (var n = e.length, i = 0; e[n++] = t[i++];);
                        e.length = n - 1
                    }
                }
            }
            x = t.support = {}, k = t.isXML = function (e) {
                var t = e && (e.ownerDocument || e)
                    .documentElement;
                return t ? "HTML" !== t.nodeName : !1
            }, O = t.setDocument = function (e) {
                var t, n, i = e ? e.ownerDocument || e : H;
                return i !== D && 9 === i.nodeType && i.documentElement ? (D = i, N = i.documentElement, n = i.defaultView, n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", $e, !1) : n.attachEvent && n.attachEvent("onunload", $e)), I = !k(i), x.attributes = r(function (e) {
                    return e.className = "i", !e.getAttribute("className")
                }), x.getElementsByTagName = r(function (e) {
                    return e.appendChild(i.createComment("")), !e.getElementsByTagName("*")
                        .length
                }), x.getElementsByClassName = me.test(i.getElementsByClassName), x.getById = r(function (e) {
                    return N.appendChild(e)
                        .id = M, !i.getElementsByName || !i.getElementsByName(M)
                        .length
                }), x.getById ? (_.find.ID = function (e, t) {
                    if ("undefined" != typeof t.getElementById && I) {
                        var n = t.getElementById(e);
                        return n && n.parentNode ? [n] : []
                    }
                }, _.filter.ID = function (e) {
                    var t = e.replace(xe, _e);
                    return function (e) {
                        return e.getAttribute("id") === t
                    }
                }) : (delete _.find.ID, _.filter.ID = function (e) {
                    var t = e.replace(xe, _e);
                    return function (e) {
                        var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }), _.find.TAG = x.getElementsByTagName ? function (e, t) {
                    return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : x.qsa ? t.querySelectorAll(e) : void 0
                } : function (e, t) {
                    var n, i = [],
                        r = 0,
                        o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = o[r++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return o
                }, _.find.CLASS = x.getElementsByClassName && function (e, t) {
                    return I ? t.getElementsByClassName(e) : void 0
                }, L = [], P = [], (x.qsa = me.test(i.querySelectorAll)) && (r(function (e) {
                    N.appendChild(e)
                        .innerHTML = "<a id='" + M + "'></a><select id='" + M + "-\f]' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']")
                        .length && P.push("[*^$]=" + ne + "*(?:''|\"\")"), e.querySelectorAll("[selected]")
                        .length || P.push("\\[" + ne + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + M + "-]")
                        .length || P.push("~="), e.querySelectorAll(":checked")
                        .length || P.push(":checked"), e.querySelectorAll("a#" + M + "+*")
                        .length || P.push(".#.+[+~]")
                }), r(function (e) {
                    var t = i.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t)
                        .setAttribute("name", "D"), e.querySelectorAll("[name=d]")
                        .length && P.push("name" + ne + "*[*^$|!~]?="), e.querySelectorAll(":enabled")
                        .length || P.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), P.push(",.*:")
                })), (x.matchesSelector = me.test(R = N.matches || N.webkitMatchesSelector || N.mozMatchesSelector || N.oMatchesSelector || N.msMatchesSelector)) && r(function (e) {
                    x.disconnectedMatch = R.call(e, "div"), R.call(e, "[s!='']:x"), L.push("!=", se)
                }), P = P.length && new RegExp(P.join("|")), L = L.length && new RegExp(L.join("|")), t = me.test(N.compareDocumentPosition), q = t || me.test(N.contains) ? function (e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        i = t && t.parentNode;
                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                } : function (e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, V = t ? function (e, t) {
                    if (e === t) return j = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !x.sortDetached && t.compareDocumentPosition(e) === n ? e === i || e.ownerDocument === H && q(H, e) ? -1 : t === i || t.ownerDocument === H && q(H, t) ? 1 : E ? ee(E, e) - ee(E, t) : 0 : 4 & n ? -1 : 1)
                } : function (e, t) {
                    if (e === t) return j = !0, 0;
                    var n, r = 0,
                        o = e.parentNode,
                        a = t.parentNode,
                        l = [e],
                        c = [t];
                    if (!o || !a) return e === i ? -1 : t === i ? 1 : o ? -1 : a ? 1 : E ? ee(E, e) - ee(E, t) : 0;
                    if (o === a) return s(e, t);
                    for (n = e; n = n.parentNode;) l.unshift(n);
                    for (n = t; n = n.parentNode;) c.unshift(n);
                    for (; l[r] === c[r];) r++;
                    return r ? s(l[r], c[r]) : l[r] === H ? -1 : c[r] === H ? 1 : 0
                }, i) : D
            }, t.matches = function (e, n) {
                return t(e, null, null, n)
            }, t.matchesSelector = function (e, n) {
                if ((e.ownerDocument || e) !== D && O(e), n = n.replace(de, "='$1']"), x.matchesSelector && I && (!L || !L.test(n)) && (!P || !P.test(n))) try {
                    var i = R.call(e, n);
                    if (i || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                } catch (r) {}
                return t(n, D, null, [e])
                    .length > 0
            }, t.contains = function (e, t) {
                return (e.ownerDocument || e) !== D && O(e), q(e, t)
            }, t.attr = function (e, t) {
                (e.ownerDocument || e) !== D && O(e);
                var n = _.attrHandle[t.toLowerCase()],
                    i = n && Y.call(_.attrHandle, t.toLowerCase()) ? n(e, t, !I) : void 0;
                return void 0 !== i ? i : x.attributes || !I ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }, t.error = function (e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, t.uniqueSort = function (e) {
                var t, n = [],
                    i = 0,
                    r = 0;
                if (j = !x.detectDuplicates, E = !x.sortStable && e.slice(0), e.sort(V), j) {
                    for (; t = e[r++];) t === e[r] && (i = n.push(r));
                    for (; i--;) e.splice(n[i], 1)
                }
                return E = null, e
            }, $ = t.getText = function (e) {
                var t, n = "",
                    i = 0,
                    r = e.nodeType;
                if (r) {
                    if (1 === r || 9 === r || 11 === r) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += $(e)
                    } else if (3 === r || 4 === r) return e.nodeValue
                } else
                    for (; t = e[i++];) n += $(t);
                return n
            }, _ = t.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: he,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function (e) {
                        return e[1] = e[1].replace(xe, _e), e[3] = (e[3] || e[4] || e[5] || "")
                            .replace(xe, _e), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function (e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                    },
                    PSEUDO: function (e) {
                        var t, n = !e[6] && e[2];
                        return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pe.test(n) && (t = T(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function (e) {
                        var t = e.replace(xe, _e)
                            .toLowerCase();
                        return "*" === e ? function () {
                            return !0
                        } : function (e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function (e) {
                        var t = U[e + " "];
                        return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && U(e, function (e) {
                            return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function (e, n, i) {
                        return function (r) {
                            var o = t.attr(r, e);
                            return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === i : "!=" === n ? o !== i : "^=" === n ? i && 0 === o.indexOf(i) : "*=" === n ? i && o.indexOf(i) > -1 : "$=" === n ? i && o.slice(-i.length) === i : "~=" === n ? (" " + o.replace(ae, " ") + " ")
                                .indexOf(i) > -1 : "|=" === n ? o === i || o.slice(0, i.length + 1) === i + "-" : !1) : !0
                        }
                    },
                    CHILD: function (e, t, n, i, r) {
                        var o = "nth" !== e.slice(0, 3),
                            s = "last" !== e.slice(-4),
                            a = "of-type" === t;
                        return 1 === i && 0 === r ? function (e) {
                            return !!e.parentNode
                        } : function (t, n, l) {
                            var c, u, d, p, f, h, g = o !== s ? "nextSibling" : "previousSibling",
                                v = t.parentNode,
                                m = a && t.nodeName.toLowerCase(),
                                y = !l && !a;
                            if (v) {
                                if (o) {
                                    for (; g;) {
                                        for (d = t; d = d[g];)
                                            if (a ? d.nodeName.toLowerCase() === m : 1 === d.nodeType) return !1;
                                        h = g = "only" === e && !h && "nextSibling"
                                    }
                                    return !0
                                }
                                if (h = [s ? v.firstChild : v.lastChild], s && y) {
                                    for (u = v[M] || (v[M] = {}), c = u[e] || [], f = c[0] === F && c[1], p = c[0] === F && c[2], d = f && v.childNodes[f]; d = ++f && d && d[g] || (p = f = 0) || h.pop();)
                                        if (1 === d.nodeType && ++p && d === t) {
                                            u[e] = [F, f, p];
                                            break
                                        }
                                } else if (y && (c = (t[M] || (t[M] = {}))[e]) && c[0] === F) p = c[1];
                                else
                                    for (;
                                        (d = ++f && d && d[g] || (p = f = 0) || h.pop()) && ((a ? d.nodeName.toLowerCase() !== m : 1 !== d.nodeType) || !++p || (y && ((d[M] || (d[M] = {}))[e] = [F, p]), d !== t)););
                                return p -= r, p === i || p % i === 0 && p / i >= 0
                            }
                        }
                    },
                    PSEUDO: function (e, n) {
                        var r, o = _.pseudos[e] || _.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return o[M] ? o(n) : o.length > 1 ? (r = [e, e, "", n], _.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, t) {
                            for (var i, r = o(e, n), s = r.length; s--;) i = ee(e, r[s]), e[i] = !(t[i] = r[s])
                        }) : function (e) {
                            return o(e, 0, r)
                        }) : o
                    }
                },
                pseudos: {
                    not: i(function (e) {
                        var t = [],
                            n = [],
                            r = C(e.replace(le, "$1"));
                        return r[M] ? i(function (e, t, n, i) {
                            for (var o, s = r(e, null, i, []), a = e.length; a--;)(o = s[a]) && (e[a] = !(t[a] = o))
                        }) : function (e, i, o) {
                            return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
                        }
                    }),
                    has: i(function (e) {
                        return function (n) {
                            return t(e, n)
                                .length > 0
                        }
                    }),
                    contains: i(function (e) {
                        return e = e.replace(xe, _e),
                            function (t) {
                                return (t.textContent || t.innerText || $(t))
                                    .indexOf(e) > -1
                            }
                    }),
                    lang: i(function (e) {
                        return fe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(xe, _e)
                            .toLowerCase(),
                            function (t) {
                                var n;
                                do
                                    if (n = I ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                                while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function (t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function (e) {
                        return e === N
                    },
                    focus: function (e) {
                        return e === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: function (e) {
                        return e.disabled === !1
                    },
                    disabled: function (e) {
                        return e.disabled === !0
                    },
                    checked: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function (e) {
                        return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                    },
                    empty: function (e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function (e) {
                        return !_.pseudos.empty(e)
                    },
                    header: function (e) {
                        return ve.test(e.nodeName)
                    },
                    input: function (e) {
                        return ge.test(e.nodeName)
                    },
                    button: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function (e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: c(function () {
                        return [0]
                    }),
                    last: c(function (e, t) {
                        return [t - 1]
                    }),
                    eq: c(function (e, t, n) {
                        return [0 > n ? n + t : n]
                    }),
                    even: c(function (e, t) {
                        for (var n = 0; t > n; n += 2) e.push(n);
                        return e
                    }),
                    odd: c(function (e, t) {
                        for (var n = 1; t > n; n += 2) e.push(n);
                        return e
                    }),
                    lt: c(function (e, t, n) {
                        for (var i = 0 > n ? n + t : n; --i >= 0;) e.push(i);
                        return e
                    }),
                    gt: c(function (e, t, n) {
                        for (var i = 0 > n ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }, _.pseudos.nth = _.pseudos.eq;
            for (w in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) _.pseudos[w] = a(w);
            for (w in {
                    submit: !0,
                    reset: !0
                }) _.pseudos[w] = l(w);
            return d.prototype = _.filters = _.pseudos, _.setFilters = new d, T = t.tokenize = function (e, n) {
                    var i, r, o, s, a, l, c, u = W[e + " "];
                    if (u) return n ? 0 : u.slice(0);
                    for (a = e, l = [], c = _.preFilter; a;) {
                        (!i || (r = ce.exec(a))) && (r && (a = a.slice(r[0].length) || a), l.push(o = [])), i = !1, (r = ue.exec(a)) && (i = r.shift(), o.push({
                            value: i,
                            type: r[0].replace(le, " ")
                        }), a = a.slice(i.length));
                        for (s in _.filter) !(r = he[s].exec(a)) || c[s] && !(r = c[s](r)) || (i = r.shift(), o.push({
                            value: i,
                            type: s,
                            matches: r
                        }), a = a.slice(i.length));
                        if (!i) break
                    }
                    return n ? a.length : a ? t.error(e) : W(e, l)
                        .slice(0)
                }, C = t.compile = function (e, t) {
                    var n, i = [],
                        r = [],
                        o = B[e + " "];
                    if (!o) {
                        for (t || (t = T(e)), n = t.length; n--;) o = y(t[n]), o[M] ? i.push(o) : r.push(o);
                        o = B(e, b(r, i)), o.selector = e
                    }
                    return o
                }, S = t.select = function (e, t, n, i) {
                    var r, o, s, a, l, c = "function" == typeof e && e,
                        d = !i && T(e = c.selector || e);
                    if (n = n || [], 1 === d.length) {
                        if (o = d[0] = d[0].slice(0), o.length > 2 && "ID" === (s = o[0])
                            .type && x.getById && 9 === t.nodeType && I && _.relative[o[1].type]) {
                            if (t = (_.find.ID(s.matches[0].replace(xe, _e), t) || [])[0], !t) return n;
                            c && (t = t.parentNode), e = e.slice(o.shift()
                                .value.length)
                        }
                        for (r = he.needsContext.test(e) ? 0 : o.length; r-- && (s = o[r], !_.relative[a = s.type]);)
                            if ((l = _.find[a]) && (i = l(s.matches[0].replace(xe, _e), be.test(o[0].type) && u(t.parentNode) || t))) {
                                if (o.splice(r, 1), e = i.length && p(o), !e) return Q.apply(n, i), n;
                                break
                            }
                    }
                    return (c || C(e, d))(i, t, !I, n, be.test(e) && u(t.parentNode) || t), n
                }, x.sortStable = M.split("")
                .sort(V)
                .join("") === M, x.detectDuplicates = !!j, O(), x.sortDetached = r(function (e) {
                    return 1 & e.compareDocumentPosition(D.createElement("div"))
                }), r(function (e) {
                    return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
                }) || o("type|href|height|width", function (e, t, n) {
                    return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                }), x.attributes && r(function (e) {
                    return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                }) || o("value", function (e, t, n) {
                    return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
                }), r(function (e) {
                    return null == e.getAttribute("disabled")
                }) || o(te, function (e, t, n) {
                    var i;
                    return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
                }), t
        }(e);
    Z.find = re, Z.expr = re.selectors, Z.expr[":"] = Z.expr.pseudos, Z.unique = re.uniqueSort, Z.text = re.getText, Z.isXMLDoc = re.isXML, Z.contains = re.contains;
    var oe = Z.expr.match.needsContext,
        se = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        ae = /^.[^:#\[\.,]*$/;
    Z.filter = function (e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? Z.find.matchesSelector(i, e) ? [i] : [] : Z.find.matches(e, Z.grep(t, function (e) {
            return 1 === e.nodeType
        }))
    }, Z.fn.extend({
        find: function (e) {
            var t, n = this.length,
                i = [],
                r = this;
            if ("string" != typeof e) return this.pushStack(Z(e)
                .filter(function () {
                    for (t = 0; n > t; t++)
                        if (Z.contains(r[t], this)) return !0
                }));
            for (t = 0; n > t; t++) Z.find(e, r[t], i);
            return i = this.pushStack(n > 1 ? Z.unique(i) : i), i.selector = this.selector ? this.selector + " " + e : e, i
        },
        filter: function (e) {
            return this.pushStack(i(this, e || [], !1))
        },
        not: function (e) {
            return this.pushStack(i(this, e || [], !0))
        },
        is: function (e) {
            return !!i(this, "string" == typeof e && oe.test(e) ? Z(e) : e || [], !1)
                .length
        }
    });
    var le, ce = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        ue = Z.fn.init = function (e, t) {
            var n, i;
            if (!e) return this;
            if ("string" == typeof e) {
                if (n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : ce.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || le)
                    .find(e) : this.constructor(t)
                    .find(e);
                if (n[1]) {
                    if (t = t instanceof Z ? t[0] : t, Z.merge(this, Z.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : K, !0)), se.test(n[1]) && Z.isPlainObject(t))
                        for (n in t) Z.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                    return this
                }
                return i = K.getElementById(n[2]), i && i.parentNode && (this.length = 1, this[0] = i), this.context = K, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : Z.isFunction(e) ? "undefined" != typeof le.ready ? le.ready(e) : e(Z) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), Z.makeArray(e, this))
        };
    ue.prototype = Z.fn, le = Z(K);
    var de = /^(?:parents|prev(?:Until|All))/,
        pe = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    Z.extend({
        dir: function (e, t, n) {
            for (var i = [], r = void 0 !== n;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (r && Z(e)
                        .is(n)) break;
                    i.push(e)
                }
            return i
        },
        sibling: function (e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), Z.fn.extend({
        has: function (e) {
            var t = Z(e, this),
                n = t.length;
            return this.filter(function () {
                for (var e = 0; n > e; e++)
                    if (Z.contains(this, t[e])) return !0
            })
        },
        closest: function (e, t) {
            for (var n, i = 0, r = this.length, o = [], s = oe.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0; r > i; i++)
                for (n = this[i]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && Z.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? Z.unique(o) : o)
        },
        index: function (e) {
            return e ? "string" == typeof e ? V.call(Z(e), this[0]) : V.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first()
                .prevAll()
                .length : -1
        },
        add: function (e, t) {
            return this.pushStack(Z.unique(Z.merge(this.get(), Z(e, t))))
        },
        addBack: function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), Z.each({
        parent: function (e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function (e) {
            return Z.dir(e, "parentNode")
        },
        parentsUntil: function (e, t, n) {
            return Z.dir(e, "parentNode", n)
        },
        next: function (e) {
            return r(e, "nextSibling")
        },
        prev: function (e) {
            return r(e, "previousSibling")
        },
        nextAll: function (e) {
            return Z.dir(e, "nextSibling")
        },
        prevAll: function (e) {
            return Z.dir(e, "previousSibling")
        },
        nextUntil: function (e, t, n) {
            return Z.dir(e, "nextSibling", n)
        },
        prevUntil: function (e, t, n) {
            return Z.dir(e, "previousSibling", n)
        },
        siblings: function (e) {
            return Z.sibling((e.parentNode || {})
                .firstChild, e)
        },
        children: function (e) {
            return Z.sibling(e.firstChild)
        },
        contents: function (e) {
            return e.contentDocument || Z.merge([], e.childNodes)
        }
    }, function (e, t) {
        Z.fn[e] = function (n, i) {
            var r = Z.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = Z.filter(i, r)), this.length > 1 && (pe[e] || Z.unique(r), de.test(e) && r.reverse()), this.pushStack(r)
        }
    });
    var fe = /\S+/g,
        he = {};
    Z.Callbacks = function (e) {
        e = "string" == typeof e ? he[e] || o(e) : Z.extend({}, e);
        var t, n, i, r, s, a, l = [],
            c = !e.once && [],
            u = function (o) {
                for (t = e.memory && o, n = !0, a = r || 0, r = 0, s = l.length, i = !0; l && s > a; a++)
                    if (l[a].apply(o[0], o[1]) === !1 && e.stopOnFalse) {
                        t = !1;
                        break
                    }
                i = !1, l && (c ? c.length && u(c.shift()) : t ? l = [] : d.disable())
            },
            d = {
                add: function () {
                    if (l) {
                        var n = l.length;
                        ! function o(t) {
                            Z.each(t, function (t, n) {
                                var i = Z.type(n);
                                "function" === i ? e.unique && d.has(n) || l.push(n) : n && n.length && "string" !== i && o(n)
                            })
                        }(arguments), i ? s = l.length : t && (r = n, u(t))
                    }
                    return this
                },
                remove: function () {
                    return l && Z.each(arguments, function (e, t) {
                        for (var n;
                            (n = Z.inArray(t, l, n)) > -1;) l.splice(n, 1), i && (s >= n && s--, a >= n && a--)
                    }), this
                },
                has: function (e) {
                    return e ? Z.inArray(e, l) > -1 : !(!l || !l.length)
                },
                empty: function () {
                    return l = [], s = 0, this
                },
                disable: function () {
                    return l = c = t = void 0, this
                },
                disabled: function () {
                    return !l
                },
                lock: function () {
                    return c = void 0, t || d.disable(), this
                },
                locked: function () {
                    return !c
                },
                fireWith: function (e, t) {
                    return !l || n && !c || (t = t || [], t = [e, t.slice ? t.slice() : t], i ? c.push(t) : u(t)), this
                },
                fire: function () {
                    return d.fireWith(this, arguments), this
                },
                fired: function () {
                    return !!n
                }
            };
        return d
    }, Z.extend({
        Deferred: function (e) {
            var t = [
                    ["resolve", "done", Z.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", Z.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", Z.Callbacks("memory")]
                ],
                n = "pending",
                i = {
                    state: function () {
                        return n
                    },
                    always: function () {
                        return r.done(arguments)
                            .fail(arguments), this
                    },
                    then: function () {
                        var e = arguments;
                        return Z.Deferred(function (n) {
                                Z.each(t, function (t, o) {
                                    var s = Z.isFunction(e[t]) && e[t];
                                    r[o[1]](function () {
                                        var e = s && s.apply(this, arguments);
                                        e && Z.isFunction(e.promise) ? e.promise()
                                            .done(n.resolve)
                                            .fail(n.reject)
                                            .progress(n.notify) : n[o[0] + "With"](this === i ? n.promise() : this, s ? [e] : arguments)
                                    })
                                }), e = null
                            })
                            .promise()
                    },
                    promise: function (e) {
                        return null != e ? Z.extend(e, i) : i
                    }
                },
                r = {};
            return i.pipe = i.then, Z.each(t, function (e, o) {
                var s = o[2],
                    a = o[3];
                i[o[1]] = s.add, a && s.add(function () {
                    n = a
                }, t[1 ^ e][2].disable, t[2][2].lock), r[o[0]] = function () {
                    return r[o[0] + "With"](this === r ? i : this, arguments), this
                }, r[o[0] + "With"] = s.fireWith
            }), i.promise(r), e && e.call(r, r), r
        },
        when: function (e) {
            var t, n, i, r = 0,
                o = U.call(arguments),
                s = o.length,
                a = 1 !== s || e && Z.isFunction(e.promise) ? s : 0,
                l = 1 === a ? e : Z.Deferred(),
                c = function (e, n, i) {
                    return function (r) {
                        n[e] = this, i[e] = arguments.length > 1 ? U.call(arguments) : r, i === t ? l.notifyWith(n, i) : --a || l.resolveWith(n, i)
                    }
                };
            if (s > 1)
                for (t = new Array(s), n = new Array(s), i = new Array(s); s > r; r++) o[r] && Z.isFunction(o[r].promise) ? o[r].promise()
                    .done(c(r, i, o))
                    .fail(l.reject)
                    .progress(c(r, n, t)) : --a;
            return a || l.resolveWith(i, o), l.promise()
        }
    });
    var ge;
    Z.fn.ready = function (e) {
        return Z.ready.promise()
            .done(e), this
    }, Z.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function (e) {
            e ? Z.readyWait++ : Z.ready(!0)
        },
        ready: function (e) {
            (e === !0 ? --Z.readyWait : Z.isReady) || (Z.isReady = !0, e !== !0 && --Z.readyWait > 0 || (ge.resolveWith(K, [Z]), Z.fn.triggerHandler && (Z(K)
                .triggerHandler("ready"), Z(K)
                .off("ready"))))
        }
    }), Z.ready.promise = function (t) {
        return ge || (ge = Z.Deferred(), "complete" === K.readyState ? setTimeout(Z.ready) : (K.addEventListener("DOMContentLoaded", s, !1), e.addEventListener("load", s, !1))), ge.promise(t)
    }, Z.ready.promise();
    var ve = Z.access = function (e, t, n, i, r, o, s) {
        var a = 0,
            l = e.length,
            c = null == n;
        if ("object" === Z.type(n)) {
            r = !0;
            for (a in n) Z.access(e, t, a, n[a], !0, o, s)
        } else if (void 0 !== i && (r = !0, Z.isFunction(i) || (s = !0), c && (s ? (t.call(e, i), t = null) : (c = t, t = function (e, t, n) {
                return c.call(Z(e), n)
            })), t))
            for (; l > a; a++) t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
        return r ? e : c ? t.call(e) : l ? t(e[0], n) : o
    };
    Z.acceptData = function (e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    }, a.uid = 1, a.accepts = Z.acceptData, a.prototype = {
        key: function (e) {
            if (!a.accepts(e)) return 0;
            var t = {},
                n = e[this.expando];
            if (!n) {
                n = a.uid++;
                try {
                    t[this.expando] = {
                        value: n
                    }, Object.defineProperties(e, t)
                } catch (i) {
                    t[this.expando] = n, Z.extend(e, t)
                }
            }
            return this.cache[n] || (this.cache[n] = {}), n
        },
        set: function (e, t, n) {
            var i, r = this.key(e),
                o = this.cache[r];
            if ("string" == typeof t) o[t] = n;
            else if (Z.isEmptyObject(o)) Z.extend(this.cache[r], t);
            else
                for (i in t) o[i] = t[i];
            return o
        },
        get: function (e, t) {
            var n = this.cache[this.key(e)];
            return void 0 === t ? n : n[t]
        },
        access: function (e, t, n) {
            var i;
            return void 0 === t || t && "string" == typeof t && void 0 === n ? (i = this.get(e, t), void 0 !== i ? i : this.get(e, Z.camelCase(t))) : (this.set(e, t, n), void 0 !== n ? n : t)
        },
        remove: function (e, t) {
            var n, i, r, o = this.key(e),
                s = this.cache[o];
            if (void 0 === t) this.cache[o] = {};
            else {
                Z.isArray(t) ? i = t.concat(t.map(Z.camelCase)) : (r = Z.camelCase(t), t in s ? i = [t, r] : (i = r, i = i in s ? [i] : i.match(fe) || [])), n = i.length;
                for (; n--;) delete s[i[n]]
            }
        },
        hasData: function (e) {
            return !Z.isEmptyObject(this.cache[e[this.expando]] || {})
        },
        discard: function (e) {
            e[this.expando] && delete this.cache[e[this.expando]]
        }
    };
    var me = new a,
        ye = new a,
        be = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        we = /([A-Z])/g;
    Z.extend({
        hasData: function (e) {
            return ye.hasData(e) || me.hasData(e)
        },
        data: function (e, t, n) {
            return ye.access(e, t, n)
        },
        removeData: function (e, t) {
            ye.remove(e, t)
        },
        _data: function (e, t, n) {
            return me.access(e, t, n)
        },
        _removeData: function (e, t) {
            me.remove(e, t)
        }
    }), Z.fn.extend({
        data: function (e, t) {
            var n, i, r, o = this[0],
                s = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (r = ye.get(o), 1 === o.nodeType && !me.get(o, "hasDataAttrs"))) {
                    for (n = s.length; n--;) s[n] && (i = s[n].name, 0 === i.indexOf("data-") && (i = Z.camelCase(i.slice(5)), l(o, i, r[i])));
                    me.set(o, "hasDataAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function () {
                ye.set(this, e)
            }) : ve(this, function (t) {
                var n, i = Z.camelCase(e);
                if (o && void 0 === t) {
                    if (n = ye.get(o, e), void 0 !== n) return n;
                    if (n = ye.get(o, i), void 0 !== n) return n;
                    if (n = l(o, i, void 0), void 0 !== n) return n
                } else this.each(function () {
                    var n = ye.get(this, i);
                    ye.set(this, i, t), -1 !== e.indexOf("-") && void 0 !== n && ye.set(this, e, t)
                })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function (e) {
            return this.each(function () {
                ye.remove(this, e)
            })
        }
    }), Z.extend({
        queue: function (e, t, n) {
            var i;
            return e ? (t = (t || "fx") + "queue", i = me.get(e, t), n && (!i || Z.isArray(n) ? i = me.access(e, t, Z.makeArray(n)) : i.push(n)), i || []) : void 0
        },
        dequeue: function (e, t) {
            t = t || "fx";
            var n = Z.queue(e, t),
                i = n.length,
                r = n.shift(),
                o = Z._queueHooks(e, t),
                s = function () {
                    Z.dequeue(e, t)
                };
            "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, s, o)), !i && o && o.empty.fire()
        },
        _queueHooks: function (e, t) {
            var n = t + "queueHooks";
            return me.get(e, n) || me.access(e, n, {
                empty: Z.Callbacks("once memory")
                    .add(function () {
                        me.remove(e, [t + "queue", n])
                    })
            })
        }
    }), Z.fn.extend({
        queue: function (e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? Z.queue(this[0], e) : void 0 === t ? this : this.each(function () {
                var n = Z.queue(this, e, t);
                Z._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && Z.dequeue(this, e)
            })
        },
        dequeue: function (e) {
            return this.each(function () {
                Z.dequeue(this, e)
            })
        },
        clearQueue: function (e) {
            return this.queue(e || "fx", [])
        },
        promise: function (e, t) {
            var n, i = 1,
                r = Z.Deferred(),
                o = this,
                s = this.length,
                a = function () {
                    --i || r.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; s--;) n = me.get(o[s], e + "queueHooks"), n && n.empty && (i++, n.empty.add(a));
            return a(), r.promise(t)
        }
    });
    var xe = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        _e = ["Top", "Right", "Bottom", "Left"],
        $e = function (e, t) {
            return e = t || e, "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e)
        },
        ke = /^(?:checkbox|radio)$/i;
    ! function () {
        var e = K.createDocumentFragment(),
            t = e.appendChild(K.createElement("div")),
            n = K.createElement("input");
        n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), G.checkClone = t.cloneNode(!0)
            .cloneNode(!0)
            .lastChild.checked, t.innerHTML = "<textarea>x</textarea>", G.noCloneChecked = !!t.cloneNode(!0)
            .lastChild.defaultValue
    }();
    var Te = "undefined";
    G.focusinBubbles = "onfocusin" in e;
    var Ce = /^key/,
        Se = /^(?:mouse|pointer|contextmenu)|click/,
        Ae = /^(?:focusinfocus|focusoutblur)$/,
        Ee = /^([^.]*)(?:\.(.+)|)$/;
    Z.event = {
        global: {},
        add: function (e, t, n, i, r) {
            var o, s, a, l, c, u, d, p, f, h, g, v = me.get(e);
            if (v)
                for (n.handler && (o = n, n = o.handler, r = o.selector), n.guid || (n.guid = Z.guid++), (l = v.events) || (l = v.events = {}), (s = v.handle) || (s = v.handle = function (t) {
                        return typeof Z !== Te && Z.event.triggered !== t.type ? Z.event.dispatch.apply(e, arguments) : void 0
                    }), t = (t || "")
                    .match(fe) || [""], c = t.length; c--;) a = Ee.exec(t[c]) || [], f = g = a[1], h = (a[2] || "")
                    .split(".")
                    .sort(), f && (d = Z.event.special[f] || {}, f = (r ? d.delegateType : d.bindType) || f, d = Z.event.special[f] || {}, u = Z.extend({
                        type: f,
                        origType: g,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: r,
                        needsContext: r && Z.expr.match.needsContext.test(r),
                        namespace: h.join(".")
                    }, o), (p = l[f]) || (p = l[f] = [], p.delegateCount = 0, d.setup && d.setup.call(e, i, h, s) !== !1 || e.addEventListener && e.addEventListener(f, s, !1)), d.add && (d.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)), r ? p.splice(p.delegateCount++, 0, u) : p.push(u), Z.event.global[f] = !0)
        },
        remove: function (e, t, n, i, r) {
            var o, s, a, l, c, u, d, p, f, h, g, v = me.hasData(e) && me.get(e);
            if (v && (l = v.events)) {
                for (t = (t || "")
                    .match(fe) || [""], c = t.length; c--;)
                    if (a = Ee.exec(t[c]) || [], f = g = a[1], h = (a[2] || "")
                        .split(".")
                        .sort(), f) {
                        for (d = Z.event.special[f] || {}, f = (i ? d.delegateType : d.bindType) || f, p = l[f] || [], a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = o = p.length; o--;) u = p[o], !r && g !== u.origType || n && n.guid !== u.guid || a && !a.test(u.namespace) || i && i !== u.selector && ("**" !== i || !u.selector) || (p.splice(o, 1), u.selector && p.delegateCount--, d.remove && d.remove.call(e, u));
                        s && !p.length && (d.teardown && d.teardown.call(e, h, v.handle) !== !1 || Z.removeEvent(e, f, v.handle), delete l[f])
                    } else
                        for (f in l) Z.event.remove(e, f + t[c], n, i, !0);
                Z.isEmptyObject(l) && (delete v.handle, me.remove(e, "events"))
            }
        },
        trigger: function (t, n, i, r) {
            var o, s, a, l, c, u, d, p = [i || K],
                f = X.call(t, "type") ? t.type : t,
                h = X.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = a = i = i || K, 3 !== i.nodeType && 8 !== i.nodeType && !Ae.test(f + Z.event.triggered) && (f.indexOf(".") >= 0 && (h = f.split("."), f = h.shift(), h.sort()), c = f.indexOf(":") < 0 && "on" + f, t = t[Z.expando] ? t : new Z.Event(f, "object" == typeof t && t), t.isTrigger = r ? 2 : 3, t.namespace = h.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : Z.makeArray(n, [t]), d = Z.event.special[f] || {}, r || !d.trigger || d.trigger.apply(i, n) !== !1)) {
                if (!r && !d.noBubble && !Z.isWindow(i)) {
                    for (l = d.delegateType || f, Ae.test(l + f) || (s = s.parentNode); s; s = s.parentNode) p.push(s), a = s;
                    a === (i.ownerDocument || K) && p.push(a.defaultView || a.parentWindow || e)
                }
                for (o = 0;
                    (s = p[o++]) && !t.isPropagationStopped();) t.type = o > 1 ? l : d.bindType || f, u = (me.get(s, "events") || {})[t.type] && me.get(s, "handle"), u && u.apply(s, n), u = c && s[c], u && u.apply && Z.acceptData(s) && (t.result = u.apply(s, n), t.result === !1 && t.preventDefault());
                return t.type = f, r || t.isDefaultPrevented() || d._default && d._default.apply(p.pop(), n) !== !1 || !Z.acceptData(i) || c && Z.isFunction(i[f]) && !Z.isWindow(i) && (a = i[c], a && (i[c] = null), Z.event.triggered = f, i[f](), Z.event.triggered = void 0,
                    a && (i[c] = a)), t.result
            }
        },
        dispatch: function (e) {
            e = Z.event.fix(e);
            var t, n, i, r, o, s = [],
                a = U.call(arguments),
                l = (me.get(this, "events") || {})[e.type] || [],
                c = Z.event.special[e.type] || {};
            if (a[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                for (s = Z.event.handlers.call(this, e, l), t = 0;
                    (r = s[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = r.elem, n = 0;
                        (o = r.handlers[n++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(o.namespace)) && (e.handleObj = o, e.data = o.data, i = ((Z.event.special[o.origType] || {})
                            .handle || o.handler)
                        .apply(r.elem, a), void 0 !== i && (e.result = i) === !1 && (e.preventDefault(), e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e), e.result
            }
        },
        handlers: function (e, t) {
            var n, i, r, o, s = [],
                a = t.delegateCount,
                l = e.target;
            if (a && l.nodeType && (!e.button || "click" !== e.type))
                for (; l !== this; l = l.parentNode || this)
                    if (l.disabled !== !0 || "click" !== e.type) {
                        for (i = [], n = 0; a > n; n++) o = t[n], r = o.selector + " ", void 0 === i[r] && (i[r] = o.needsContext ? Z(r, this)
                            .index(l) >= 0 : Z.find(r, this, null, [l])
                            .length), i[r] && i.push(o);
                        i.length && s.push({
                            elem: l,
                            handlers: i
                        })
                    }
            return a < t.length && s.push({
                elem: this,
                handlers: t.slice(a)
            }), s
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (e, t) {
                var n, i, r, o = t.button;
                return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || K, i = n.documentElement, r = n.body, e.pageX = t.clientX + (i && i.scrollLeft || r && r.scrollLeft || 0) - (i && i.clientLeft || r && r.clientLeft || 0), e.pageY = t.clientY + (i && i.scrollTop || r && r.scrollTop || 0) - (i && i.clientTop || r && r.clientTop || 0)), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        fix: function (e) {
            if (e[Z.expando]) return e;
            var t, n, i, r = e.type,
                o = e,
                s = this.fixHooks[r];
            for (s || (this.fixHooks[r] = s = Se.test(r) ? this.mouseHooks : Ce.test(r) ? this.keyHooks : {}), i = s.props ? this.props.concat(s.props) : this.props, e = new Z.Event(o), t = i.length; t--;) n = i[t], e[n] = o[n];
            return e.target || (e.target = K), 3 === e.target.nodeType && (e.target = e.target.parentNode), s.filter ? s.filter(e, o) : e
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function () {
                    return this !== d() && this.focus ? (this.focus(), !1) : void 0
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    return this === d() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function () {
                    return "checkbox" === this.type && this.click && Z.nodeName(this, "input") ? (this.click(), !1) : void 0
                },
                _default: function (e) {
                    return Z.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function (e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function (e, t, n, i) {
            var r = Z.extend(new Z.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? Z.event.trigger(r, null, t) : Z.event.dispatch.call(t, r), r.isDefaultPrevented() && n.preventDefault()
        }
    }, Z.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    }, Z.Event = function (e, t) {
        return this instanceof Z.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? c : u) : this.type = e, t && Z.extend(this, t), this.timeStamp = e && e.timeStamp || Z.now(), void(this[Z.expando] = !0)) : new Z.Event(e, t)
    }, Z.Event.prototype = {
        isDefaultPrevented: u,
        isPropagationStopped: u,
        isImmediatePropagationStopped: u,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = c, e && e.preventDefault && e.preventDefault()
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = c, e && e.stopPropagation && e.stopPropagation()
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = c, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, Z.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (e, t) {
        Z.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function (e) {
                var n, i = this,
                    r = e.relatedTarget,
                    o = e.handleObj;
                return (!r || r !== i && !Z.contains(i, r)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), G.focusinBubbles || Z.each({
        focus: "focusin",
        blur: "focusout"
    }, function (e, t) {
        var n = function (e) {
            Z.event.simulate(t, e.target, Z.event.fix(e), !0)
        };
        Z.event.special[t] = {
            setup: function () {
                var i = this.ownerDocument || this,
                    r = me.access(i, t);
                r || i.addEventListener(e, n, !0), me.access(i, t, (r || 0) + 1)
            },
            teardown: function () {
                var i = this.ownerDocument || this,
                    r = me.access(i, t) - 1;
                r ? me.access(i, t, r) : (i.removeEventListener(e, n, !0), me.remove(i, t))
            }
        }
    }), Z.fn.extend({
        on: function (e, t, n, i, r) {
            var o, s;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t, t = void 0);
                for (s in e) this.on(s, t, n, e[s], r);
                return this
            }
            if (null == n && null == i ? (i = t, n = t = void 0) : null == i && ("string" == typeof t ? (i = n, n = void 0) : (i = n, n = t, t = void 0)), i === !1) i = u;
            else if (!i) return this;
            return 1 === r && (o = i, i = function (e) {
                return Z()
                    .off(e), o.apply(this, arguments)
            }, i.guid = o.guid || (o.guid = Z.guid++)), this.each(function () {
                Z.event.add(this, e, i, n, t)
            })
        },
        one: function (e, t, n, i) {
            return this.on(e, t, n, i, 1)
        },
        off: function (e, t, n) {
            var i, r;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, Z(e.delegateTarget)
                .off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (r in e) this.off(r, t, e[r]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = u), this.each(function () {
                Z.event.remove(this, e, n, t)
            })
        },
        trigger: function (e, t) {
            return this.each(function () {
                Z.event.trigger(e, t, this)
            })
        },
        triggerHandler: function (e, t) {
            var n = this[0];
            return n ? Z.event.trigger(e, t, n, !0) : void 0
        }
    });
    var je = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Oe = /<([\w:]+)/,
        De = /<|&#?\w+;/,
        Ne = /<(?:script|style|link)/i,
        Ie = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Pe = /^$|\/(?:java|ecma)script/i,
        Le = /^true\/(.*)/,
        Re = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        qe = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    qe.optgroup = qe.option, qe.tbody = qe.tfoot = qe.colgroup = qe.caption = qe.thead, qe.th = qe.td, Z.extend({
        clone: function (e, t, n) {
            var i, r, o, s, a = e.cloneNode(!0),
                l = Z.contains(e.ownerDocument, e);
            if (!(G.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Z.isXMLDoc(e)))
                for (s = m(a), o = m(e), i = 0, r = o.length; r > i; i++) y(o[i], s[i]);
            if (t)
                if (n)
                    for (o = o || m(e), s = s || m(a), i = 0, r = o.length; r > i; i++) v(o[i], s[i]);
                else v(e, a);
            return s = m(a, "script"), s.length > 0 && g(s, !l && m(e, "script")), a
        },
        buildFragment: function (e, t, n, i) {
            for (var r, o, s, a, l, c, u = t.createDocumentFragment(), d = [], p = 0, f = e.length; f > p; p++)
                if (r = e[p], r || 0 === r)
                    if ("object" === Z.type(r)) Z.merge(d, r.nodeType ? [r] : r);
                    else if (De.test(r)) {
                for (o = o || u.appendChild(t.createElement("div")), s = (Oe.exec(r) || ["", ""])[1].toLowerCase(), a = qe[s] || qe._default, o.innerHTML = a[1] + r.replace(je, "<$1></$2>") + a[2], c = a[0]; c--;) o = o.lastChild;
                Z.merge(d, o.childNodes), o = u.firstChild, o.textContent = ""
            } else d.push(t.createTextNode(r));
            for (u.textContent = "", p = 0; r = d[p++];)
                if ((!i || -1 === Z.inArray(r, i)) && (l = Z.contains(r.ownerDocument, r), o = m(u.appendChild(r), "script"), l && g(o), n))
                    for (c = 0; r = o[c++];) Pe.test(r.type || "") && n.push(r);
            return u
        },
        cleanData: function (e) {
            for (var t, n, i, r, o = Z.event.special, s = 0; void 0 !== (n = e[s]); s++) {
                if (Z.acceptData(n) && (r = n[me.expando], r && (t = me.cache[r]))) {
                    if (t.events)
                        for (i in t.events) o[i] ? Z.event.remove(n, i) : Z.removeEvent(n, i, t.handle);
                    me.cache[r] && delete me.cache[r]
                }
                delete ye.cache[n[ye.expando]]
            }
        }
    }), Z.fn.extend({
        text: function (e) {
            return ve(this, function (e) {
                return void 0 === e ? Z.text(this) : this.empty()
                    .each(function () {
                        (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
                    })
            }, null, e, arguments.length)
        },
        append: function () {
            return this.domManip(arguments, function (e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = p(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function () {
            return this.domManip(arguments, function (e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = p(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function () {
            return this.domManip(arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function () {
            return this.domManip(arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function (e, t) {
            for (var n, i = e ? Z.filter(e, this) : this, r = 0; null != (n = i[r]); r++) t || 1 !== n.nodeType || Z.cleanData(m(n)), n.parentNode && (t && Z.contains(n.ownerDocument, n) && g(m(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function () {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (Z.cleanData(m(e, !1)), e.textContent = "");
            return this
        },
        clone: function (e, t) {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function () {
                return Z.clone(this, e, t)
            })
        },
        html: function (e) {
            return ve(this, function (e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !Ne.test(e) && !qe[(Oe.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(je, "<$1></$2>");
                    try {
                        for (; i > n; n++) t = this[n] || {}, 1 === t.nodeType && (Z.cleanData(m(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (r) {}
                }
                t && this.empty()
                    .append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function () {
            var e = arguments[0];
            return this.domManip(arguments, function (t) {
                e = this.parentNode, Z.cleanData(m(this)), e && e.replaceChild(t, this)
            }), e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function (e) {
            return this.remove(e, !0)
        },
        domManip: function (e, t) {
            e = W.apply([], e);
            var n, i, r, o, s, a, l = 0,
                c = this.length,
                u = this,
                d = c - 1,
                p = e[0],
                g = Z.isFunction(p);
            if (g || c > 1 && "string" == typeof p && !G.checkClone && Ie.test(p)) return this.each(function (n) {
                var i = u.eq(n);
                g && (e[0] = p.call(this, n, i.html())), i.domManip(e, t)
            });
            if (c && (n = Z.buildFragment(e, this[0].ownerDocument, !1, this), i = n.firstChild, 1 === n.childNodes.length && (n = i), i)) {
                for (r = Z.map(m(n, "script"), f), o = r.length; c > l; l++) s = n, l !== d && (s = Z.clone(s, !0, !0), o && Z.merge(r, m(s, "script"))), t.call(this[l], s, l);
                if (o)
                    for (a = r[r.length - 1].ownerDocument, Z.map(r, h), l = 0; o > l; l++) s = r[l], Pe.test(s.type || "") && !me.access(s, "globalEval") && Z.contains(a, s) && (s.src ? Z._evalUrl && Z._evalUrl(s.src) : Z.globalEval(s.textContent.replace(Re, "")))
            }
            return this
        }
    }), Z.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, t) {
        Z.fn[e] = function (e) {
            for (var n, i = [], r = Z(e), o = r.length - 1, s = 0; o >= s; s++) n = s === o ? this : this.clone(!0), Z(r[s])[t](n), B.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var Me, He = {},
        Fe = /^margin/,
        ze = new RegExp("^(" + xe + ")(?!px)[a-z%]+$", "i"),
        Ue = function (t) {
            return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null)
        };
    ! function () {
        function t() {
            s.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", s.innerHTML = "", r.appendChild(o);
            var t = e.getComputedStyle(s, null);
            n = "1%" !== t.top, i = "4px" === t.width, r.removeChild(o)
        }
        var n, i, r = K.documentElement,
            o = K.createElement("div"),
            s = K.createElement("div");
        s.style && (s.style.backgroundClip = "content-box", s.cloneNode(!0)
            .style.backgroundClip = "", G.clearCloneStyle = "content-box" === s.style.backgroundClip, o.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", o.appendChild(s), e.getComputedStyle && Z.extend(G, {
                pixelPosition: function () {
                    return t(), n
                },
                boxSizingReliable: function () {
                    return null == i && t(), i
                },
                reliableMarginRight: function () {
                    var t, n = s.appendChild(K.createElement("div"));
                    return n.style.cssText = s.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", n.style.marginRight = n.style.width = "0", s.style.width = "1px", r.appendChild(o), t = !parseFloat(e.getComputedStyle(n, null)
                        .marginRight), r.removeChild(o), s.removeChild(n), t
                }
            }))
    }(), Z.swap = function (e, t, n, i) {
        var r, o, s = {};
        for (o in t) s[o] = e.style[o], e.style[o] = t[o];
        r = n.apply(e, i || []);
        for (o in t) e.style[o] = s[o];
        return r
    };
    var We = /^(none|table(?!-c[ea]).+)/,
        Be = new RegExp("^(" + xe + ")(.*)$", "i"),
        Ve = new RegExp("^([+-])=(" + xe + ")", "i"),
        Je = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Ye = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        Xe = ["Webkit", "O", "Moz", "ms"];
    Z.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var n = x(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": "cssFloat"
        },
        style: function (e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, s, a = Z.camelCase(t),
                    l = e.style;
                return t = Z.cssProps[a] || (Z.cssProps[a] = $(l, a)), s = Z.cssHooks[t] || Z.cssHooks[a], void 0 === n ? s && "get" in s && void 0 !== (r = s.get(e, !1, i)) ? r : l[t] : (o = typeof n, "string" === o && (r = Ve.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(Z.css(e, t)), o = "number"), null != n && n === n && ("number" !== o || Z.cssNumber[a] || (n += "px"), G.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), s && "set" in s && void 0 === (n = s.set(e, n, i)) || (l[t] = n)), void 0)
            }
        },
        css: function (e, t, n, i) {
            var r, o, s, a = Z.camelCase(t);
            return t = Z.cssProps[a] || (Z.cssProps[a] = $(e.style, a)), s = Z.cssHooks[t] || Z.cssHooks[a], s && "get" in s && (r = s.get(e, !0, n)), void 0 === r && (r = x(e, t, i)), "normal" === r && t in Ye && (r = Ye[t]), "" === n || n ? (o = parseFloat(r), n === !0 || Z.isNumeric(o) ? o || 0 : r) : r
        }
    }), Z.each(["height", "width"], function (e, t) {
        Z.cssHooks[t] = {
            get: function (e, n, i) {
                return n ? We.test(Z.css(e, "display")) && 0 === e.offsetWidth ? Z.swap(e, Je, function () {
                    return C(e, t, i)
                }) : C(e, t, i) : void 0
            },
            set: function (e, n, i) {
                var r = i && Ue(e);
                return k(e, n, i ? T(e, t, i, "border-box" === Z.css(e, "boxSizing", !1, r), r) : 0)
            }
        }
    }), Z.cssHooks.marginRight = _(G.reliableMarginRight, function (e, t) {
        return t ? Z.swap(e, {
            display: "inline-block"
        }, x, [e, "marginRight"]) : void 0
    }), Z.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (e, t) {
        Z.cssHooks[e + t] = {
            expand: function (n) {
                for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) r[e + _e[i] + t] = o[i] || o[i - 2] || o[0];
                return r
            }
        }, Fe.test(e) || (Z.cssHooks[e + t].set = k)
    }), Z.fn.extend({
        css: function (e, t) {
            return ve(this, function (e, t, n) {
                var i, r, o = {},
                    s = 0;
                if (Z.isArray(t)) {
                    for (i = Ue(e), r = t.length; r > s; s++) o[t[s]] = Z.css(e, t[s], !1, i);
                    return o
                }
                return void 0 !== n ? Z.style(e, t, n) : Z.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function () {
            return S(this, !0)
        },
        hide: function () {
            return S(this)
        },
        toggle: function (e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                $e(this) ? Z(this)
                    .show() : Z(this)
                    .hide()
            })
        }
    }), Z.Tween = A, A.prototype = {
        constructor: A,
        init: function (e, t, n, i, r, o) {
            this.elem = e, this.prop = n, this.easing = r || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (Z.cssNumber[n] ? "" : "px")
        },
        cur: function () {
            var e = A.propHooks[this.prop];
            return e && e.get ? e.get(this) : A.propHooks._default.get(this)
        },
        run: function (e) {
            var t, n = A.propHooks[this.prop];
            return this.options.duration ? this.pos = t = Z.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : A.propHooks._default.set(this), this
        }
    }, A.prototype.init.prototype = A.prototype, A.propHooks = {
        _default: {
            get: function (e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Z.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function (e) {
                Z.fx.step[e.prop] ? Z.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Z.cssProps[e.prop]] || Z.cssHooks[e.prop]) ? Z.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, A.propHooks.scrollTop = A.propHooks.scrollLeft = {
        set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, Z.easing = {
        linear: function (e) {
            return e
        },
        swing: function (e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, Z.fx = A.prototype.init, Z.fx.step = {};
    var Ge, Ke, Qe = /^(?:toggle|show|hide)$/,
        Ze = new RegExp("^(?:([+-])=|)(" + xe + ")([a-z%]*)$", "i"),
        et = /queueHooks$/,
        tt = [D],
        nt = {
            "*": [function (e, t) {
                var n = this.createTween(e, t),
                    i = n.cur(),
                    r = Ze.exec(t),
                    o = r && r[3] || (Z.cssNumber[e] ? "" : "px"),
                    s = (Z.cssNumber[e] || "px" !== o && +i) && Ze.exec(Z.css(n.elem, e)),
                    a = 1,
                    l = 20;
                if (s && s[3] !== o) {
                    o = o || s[3], r = r || [], s = +i || 1;
                    do a = a || ".5", s /= a, Z.style(n.elem, e, s + o); while (a !== (a = n.cur() / i) && 1 !== a && --l)
                }
                return r && (s = n.start = +s || +i || 0, n.unit = o, n.end = r[1] ? s + (r[1] + 1) * r[2] : +r[2]), n
            }]
        };
    Z.Animation = Z.extend(I, {
            tweener: function (e, t) {
                Z.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                for (var n, i = 0, r = e.length; r > i; i++) n = e[i], nt[n] = nt[n] || [], nt[n].unshift(t)
            },
            prefilter: function (e, t) {
                t ? tt.unshift(e) : tt.push(e)
            }
        }), Z.speed = function (e, t, n) {
            var i = e && "object" == typeof e ? Z.extend({}, e) : {
                complete: n || !n && t || Z.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !Z.isFunction(t) && t
            };
            return i.duration = Z.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in Z.fx.speeds ? Z.fx.speeds[i.duration] : Z.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function () {
                Z.isFunction(i.old) && i.old.call(this), i.queue && Z.dequeue(this, i.queue)
            }, i
        }, Z.fn.extend({
            fadeTo: function (e, t, n, i) {
                return this.filter($e)
                    .css("opacity", 0)
                    .show()
                    .end()
                    .animate({
                        opacity: t
                    }, e, n, i)
            },
            animate: function (e, t, n, i) {
                var r = Z.isEmptyObject(e),
                    o = Z.speed(t, n, i),
                    s = function () {
                        var t = I(this, Z.extend({}, e), o);
                        (r || me.get(this, "finish")) && t.stop(!0)
                    };
                return s.finish = s, r || o.queue === !1 ? this.each(s) : this.queue(o.queue, s)
            },
            stop: function (e, t, n) {
                var i = function (e) {
                    var t = e.stop;
                    delete e.stop, t(n)
                };
                return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function () {
                    var t = !0,
                        r = null != e && e + "queueHooks",
                        o = Z.timers,
                        s = me.get(this);
                    if (r) s[r] && s[r].stop && i(s[r]);
                    else
                        for (r in s) s[r] && s[r].stop && et.test(r) && i(s[r]);
                    for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
                    (t || !n) && Z.dequeue(this, e)
                })
            },
            finish: function (e) {
                return e !== !1 && (e = e || "fx"), this.each(function () {
                    var t, n = me.get(this),
                        i = n[e + "queue"],
                        r = n[e + "queueHooks"],
                        o = Z.timers,
                        s = i ? i.length : 0;
                    for (n.finish = !0, Z.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                    for (t = 0; s > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
                    delete n.finish
                })
            }
        }), Z.each(["toggle", "show", "hide"], function (e, t) {
            var n = Z.fn[t];
            Z.fn[t] = function (e, i, r) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(j(t, !0), e, i, r)
            }
        }), Z.each({
            slideDown: j("show"),
            slideUp: j("hide"),
            slideToggle: j("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function (e, t) {
            Z.fn[e] = function (e, n, i) {
                return this.animate(t, e, n, i)
            }
        }), Z.timers = [], Z.fx.tick = function () {
            var e, t = 0,
                n = Z.timers;
            for (Ge = Z.now(); t < n.length; t++) e = n[t], e() || n[t] !== e || n.splice(t--, 1);
            n.length || Z.fx.stop(), Ge = void 0
        }, Z.fx.timer = function (e) {
            Z.timers.push(e), e() ? Z.fx.start() : Z.timers.pop()
        }, Z.fx.interval = 13, Z.fx.start = function () {
            Ke || (Ke = setInterval(Z.fx.tick, Z.fx.interval))
        }, Z.fx.stop = function () {
            clearInterval(Ke), Ke = null
        }, Z.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, Z.fn.delay = function (e, t) {
            return e = Z.fx ? Z.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n) {
                var i = setTimeout(t, e);
                n.stop = function () {
                    clearTimeout(i)
                }
            })
        },
        function () {
            var e = K.createElement("input"),
                t = K.createElement("select"),
                n = t.appendChild(K.createElement("option"));
            e.type = "checkbox", G.checkOn = "" !== e.value, G.optSelected = n.selected, t.disabled = !0, G.optDisabled = !n.disabled, e = K.createElement("input"), e.value = "t", e.type = "radio", G.radioValue = "t" === e.value
        }();
    var it, rt, ot = Z.expr.attrHandle;
    Z.fn.extend({
        attr: function (e, t) {
            return ve(this, Z.attr, e, t, arguments.length > 1)
        },
        removeAttr: function (e) {
            return this.each(function () {
                Z.removeAttr(this, e)
            })
        }
    }), Z.extend({
        attr: function (e, t, n) {
            var i, r, o = e.nodeType;
            if (e && 3 !== o && 8 !== o && 2 !== o) return typeof e.getAttribute === Te ? Z.prop(e, t, n) : (1 === o && Z.isXMLDoc(e) || (t = t.toLowerCase(), i = Z.attrHooks[t] || (Z.expr.match.bool.test(t) ? rt : it)), void 0 === n ? i && "get" in i && null !== (r = i.get(e, t)) ? r : (r = Z.find.attr(e, t), null == r ? void 0 : r) : null !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : void Z.removeAttr(e, t))
        },
        removeAttr: function (e, t) {
            var n, i, r = 0,
                o = t && t.match(fe);
            if (o && 1 === e.nodeType)
                for (; n = o[r++];) i = Z.propFix[n] || n, Z.expr.match.bool.test(n) && (e[i] = !1), e.removeAttribute(n)
        },
        attrHooks: {
            type: {
                set: function (e, t) {
                    if (!G.radioValue && "radio" === t && Z.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }
    }), rt = {
        set: function (e, t, n) {
            return t === !1 ? Z.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, Z.each(Z.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var n = ot[t] || Z.find.attr;
        ot[t] = function (e, t, i) {
            var r, o;
            return i || (o = ot[t], ot[t] = r, r = null != n(e, t, i) ? t.toLowerCase() : null, ot[t] = o), r
        }
    });
    var st = /^(?:input|select|textarea|button)$/i;
    Z.fn.extend({
        prop: function (e, t) {
            return ve(this, Z.prop, e, t, arguments.length > 1)
        },
        removeProp: function (e) {
            return this.each(function () {
                delete this[Z.propFix[e] || e]
            })
        }
    }), Z.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function (e, t, n) {
            var i, r, o, s = e.nodeType;
            if (e && 3 !== s && 8 !== s && 2 !== s) return o = 1 !== s || !Z.isXMLDoc(e), o && (t = Z.propFix[t] || t, r = Z.propHooks[t]), void 0 !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function (e) {
                    return e.hasAttribute("tabindex") || st.test(e.nodeName) || e.href ? e.tabIndex : -1
                }
            }
        }
    }), G.optSelected || (Z.propHooks.selected = {
        get: function (e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        }
    }), Z.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        Z.propFix[this.toLowerCase()] = this
    });
    var at = /[\t\r\n\f]/g;
    Z.fn.extend({
        addClass: function (e) {
            var t, n, i, r, o, s, a = "string" == typeof e && e,
                l = 0,
                c = this.length;
            if (Z.isFunction(e)) return this.each(function (t) {
                Z(this)
                    .addClass(e.call(this, t, this.className))
            });
            if (a)
                for (t = (e || "")
                    .match(fe) || []; c > l; l++)
                    if (n = this[l], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ")
                            .replace(at, " ") : " ")) {
                        for (o = 0; r = t[o++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                        s = Z.trim(i), n.className !== s && (n.className = s)
                    }
            return this
        },
        removeClass: function (e) {
            var t, n, i, r, o, s, a = 0 === arguments.length || "string" == typeof e && e,
                l = 0,
                c = this.length;
            if (Z.isFunction(e)) return this.each(function (t) {
                Z(this)
                    .removeClass(e.call(this, t, this.className))
            });
            if (a)
                for (t = (e || "")
                    .match(fe) || []; c > l; l++)
                    if (n = this[l], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ")
                            .replace(at, " ") : "")) {
                        for (o = 0; r = t[o++];)
                            for (; i.indexOf(" " + r + " ") >= 0;) i = i.replace(" " + r + " ", " ");
                        s = e ? Z.trim(i) : "", n.className !== s && (n.className = s)
                    }
            return this
        },
        toggleClass: function (e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : Z.isFunction(e) ? this.each(function (n) {
                Z(this)
                    .toggleClass(e.call(this, n, this.className, t), t)
            }) : this.each(function () {
                if ("string" === n)
                    for (var t, i = 0, r = Z(this), o = e.match(fe) || []; t = o[i++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                else(n === Te || "boolean" === n) && (this.className && me.set(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : me.get(this, "__className__") || "")
            })
        },
        hasClass: function (e) {
            for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ")
                    .replace(at, " ")
                    .indexOf(t) >= 0) return !0;
            return !1
        }
    });
    var lt = /\r/g;
    Z.fn.extend({
        val: function (e) {
            var t, n, i, r = this[0]; {
                if (arguments.length) return i = Z.isFunction(e), this.each(function (n) {
                    var r;
                    1 === this.nodeType && (r = i ? e.call(this, n, Z(this)
                        .val()) : e, null == r ? r = "" : "number" == typeof r ? r += "" : Z.isArray(r) && (r = Z.map(r, function (e) {
                        return null == e ? "" : e + ""
                    })), t = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, r, "value") || (this.value = r))
                });
                if (r) return t = Z.valHooks[r.type] || Z.valHooks[r.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(r, "value")) ? n : (n = r.value, "string" == typeof n ? n.replace(lt, "") : null == n ? "" : n)
            }
        }
    }), Z.extend({
        valHooks: {
            option: {
                get: function (e) {
                    var t = Z.find.attr(e, "value");
                    return null != t ? t : Z.trim(Z.text(e))
                }
            },
            select: {
                get: function (e) {
                    for (var t, n, i = e.options, r = e.selectedIndex, o = "select-one" === e.type || 0 > r, s = o ? null : [], a = o ? r + 1 : i.length, l = 0 > r ? a : o ? r : 0; a > l; l++)
                        if (n = i[l], (n.selected || l === r) && (G.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !Z.nodeName(n.parentNode, "optgroup"))) {
                            if (t = Z(n)
                                .val(), o) return t;
                            s.push(t)
                        }
                    return s
                },
                set: function (e, t) {
                    for (var n, i, r = e.options, o = Z.makeArray(t), s = r.length; s--;) i = r[s], (i.selected = Z.inArray(i.value, o) >= 0) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        }
    }), Z.each(["radio", "checkbox"], function () {
        Z.valHooks[this] = {
            set: function (e, t) {
                return Z.isArray(t) ? e.checked = Z.inArray(Z(e)
                    .val(), t) >= 0 : void 0
            }
        }, G.checkOn || (Z.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
        Z.fn[t] = function (e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), Z.fn.extend({
        hover: function (e, t) {
            return this.mouseenter(e)
                .mouseleave(t || e)
        },
        bind: function (e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function (e, t) {
            return this.off(e, null, t)
        },
        delegate: function (e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function (e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var ct = Z.now(),
        ut = /\?/;
    Z.parseJSON = function (e) {
        return JSON.parse(e + "")
    }, Z.parseXML = function (e) {
        var t, n;
        if (!e || "string" != typeof e) return null;
        try {
            n = new DOMParser, t = n.parseFromString(e, "text/xml")
        } catch (i) {
            t = void 0
        }
        return (!t || t.getElementsByTagName("parsererror")
            .length) && Z.error("Invalid XML: " + e), t
    };
    var dt = /#.*$/,
        pt = /([?&])_=[^&]*/,
        ft = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        ht = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        gt = /^(?:GET|HEAD)$/,
        vt = /^\/\//,
        mt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        yt = {},
        bt = {},
        wt = "*/".concat("*"),
        xt = e.location.href,
        _t = mt.exec(xt.toLowerCase()) || [];
    Z.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: xt,
            type: "GET",
            isLocal: ht.test(_t[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": wt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": Z.parseJSON,
                "text xml": Z.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function (e, t) {
            return t ? R(R(e, Z.ajaxSettings), t) : R(Z.ajaxSettings, e)
        },
        ajaxPrefilter: P(yt),
        ajaxTransport: P(bt),
        ajax: function (e, t) {
            function n(e, t, n, s) {
                var l, u, m, y, w, _ = t;
                2 !== b && (b = 2, a && clearTimeout(a), i = void 0, o = s || "", x.readyState = e > 0 ? 4 : 0, l = e >= 200 && 300 > e || 304 === e, n && (y = q(d, x, n)), y = M(d, y, x, l), l ? (d.ifModified && (w = x.getResponseHeader("Last-Modified"), w && (Z.lastModified[r] = w), w = x.getResponseHeader("etag"), w && (Z.etag[r] = w)), 204 === e || "HEAD" === d.type ? _ = "nocontent" : 304 === e ? _ = "notmodified" : (_ = y.state, u = y.data, m = y.error, l = !m)) : (m = _, (e || !_) && (_ = "error", 0 > e && (e = 0))), x.status = e, x.statusText = (t || _) + "", l ? h.resolveWith(p, [u, _, x]) : h.rejectWith(p, [x, _, m]), x.statusCode(v), v = void 0, c && f.trigger(l ? "ajaxSuccess" : "ajaxError", [x, d, l ? u : m]), g.fireWith(p, [x, _]), c && (f.trigger("ajaxComplete", [x, d]), --Z.active || Z.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var i, r, o, s, a, l, c, u, d = Z.ajaxSetup({}, t),
                p = d.context || d,
                f = d.context && (p.nodeType || p.jquery) ? Z(p) : Z.event,
                h = Z.Deferred(),
                g = Z.Callbacks("once memory"),
                v = d.statusCode || {},
                m = {},
                y = {},
                b = 0,
                w = "canceled",
                x = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                        var t;
                        if (2 === b) {
                            if (!s)
                                for (s = {}; t = ft.exec(o);) s[t[1].toLowerCase()] = t[2];
                            t = s[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function () {
                        return 2 === b ? o : null
                    },
                    setRequestHeader: function (e, t) {
                        var n = e.toLowerCase();
                        return b || (e = y[n] = y[n] || e, m[e] = t), this
                    },
                    overrideMimeType: function (e) {
                        return b || (d.mimeType = e), this
                    },
                    statusCode: function (e) {
                        var t;
                        if (e)
                            if (2 > b)
                                for (t in e) v[t] = [v[t], e[t]];
                            else x.always(e[x.status]);
                        return this
                    },
                    abort: function (e) {
                        var t = e || w;
                        return i && i.abort(t), n(0, t), this
                    }
                };
            if (h.promise(x)
                .complete = g.add, x.success = x.done, x.error = x.fail, d.url = ((e || d.url || xt) + "")
                .replace(dt, "")
                .replace(vt, _t[1] + "//"), d.type = t.method || t.type || d.method || d.type, d.dataTypes = Z.trim(d.dataType || "*")
                .toLowerCase()
                .match(fe) || [""], null == d.crossDomain && (l = mt.exec(d.url.toLowerCase()), d.crossDomain = !(!l || l[1] === _t[1] && l[2] === _t[2] && (l[3] || ("http:" === l[1] ? "80" : "443")) === (_t[3] || ("http:" === _t[1] ? "80" : "443")))), d.data && d.processData && "string" != typeof d.data && (d.data = Z.param(d.data, d.traditional)), L(yt, d, t, x), 2 === b) return x;
            c = Z.event && d.global, c && 0 === Z.active++ && Z.event.trigger("ajaxStart"), d.type = d.type.toUpperCase(), d.hasContent = !gt.test(d.type), r = d.url, d.hasContent || (d.data && (r = d.url += (ut.test(r) ? "&" : "?") + d.data, delete d.data), d.cache === !1 && (d.url = pt.test(r) ? r.replace(pt, "$1_=" + ct++) : r + (ut.test(r) ? "&" : "?") + "_=" + ct++)), d.ifModified && (Z.lastModified[r] && x.setRequestHeader("If-Modified-Since", Z.lastModified[r]), Z.etag[r] && x.setRequestHeader("If-None-Match", Z.etag[r])), (d.data && d.hasContent && d.contentType !== !1 || t.contentType) && x.setRequestHeader("Content-Type", d.contentType), x.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + wt + "; q=0.01" : "") : d.accepts["*"]);
            for (u in d.headers) x.setRequestHeader(u, d.headers[u]);
            if (d.beforeSend && (d.beforeSend.call(p, x, d) === !1 || 2 === b)) return x.abort();
            w = "abort";
            for (u in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) x[u](d[u]);
            if (i = L(bt, d, t, x)) {
                x.readyState = 1, c && f.trigger("ajaxSend", [x, d]), d.async && d.timeout > 0 && (a = setTimeout(function () {
                    x.abort("timeout")
                }, d.timeout));
                try {
                    b = 1, i.send(m, n)
                } catch (_) {
                    if (!(2 > b)) throw _;
                    n(-1, _)
                }
            } else n(-1, "No Transport");
            return x
        },
        getJSON: function (e, t, n) {
            return Z.get(e, t, n, "json")
        },
        getScript: function (e, t) {
            return Z.get(e, void 0, t, "script")
        }
    }), Z.each(["get", "post"], function (e, t) {
        Z[t] = function (e, n, i, r) {
            return Z.isFunction(n) && (r = r || i, i = n, n = void 0), Z.ajax({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: i
            })
        }
    }), Z._evalUrl = function (e) {
        return Z.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, Z.fn.extend({
        wrapAll: function (e) {
            var t;
            return Z.isFunction(e) ? this.each(function (t) {
                Z(this)
                    .wrapAll(e.call(this, t))
            }) : (this[0] && (t = Z(e, this[0].ownerDocument)
                .eq(0)
                .clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                    for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                    return e
                })
                .append(this)), this)
        },
        wrapInner: function (e) {
            return Z.isFunction(e) ? this.each(function (t) {
                Z(this)
                    .wrapInner(e.call(this, t))
            }) : this.each(function () {
                var t = Z(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function (e) {
            var t = Z.isFunction(e);
            return this.each(function (n) {
                Z(this)
                    .wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function () {
            return this.parent()
                .each(function () {
                    Z.nodeName(this, "body") || Z(this)
                        .replaceWith(this.childNodes)
                })
                .end()
        }
    }), Z.expr.filters.hidden = function (e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0
    }, Z.expr.filters.visible = function (e) {
        return !Z.expr.filters.hidden(e)
    };
    var $t = /%20/g,
        kt = /\[\]$/,
        Tt = /\r?\n/g,
        Ct = /^(?:submit|button|image|reset|file)$/i,
        St = /^(?:input|select|textarea|keygen)/i;
    Z.param = function (e, t) {
        var n, i = [],
            r = function (e, t) {
                t = Z.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = Z.ajaxSettings && Z.ajaxSettings.traditional), Z.isArray(e) || e.jquery && !Z.isPlainObject(e)) Z.each(e, function () {
            r(this.name, this.value)
        });
        else
            for (n in e) H(n, e[n], t, r);
        return i.join("&")
            .replace($t, "+")
    }, Z.fn.extend({
        serialize: function () {
            return Z.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                    var e = Z.prop(this, "elements");
                    return e ? Z.makeArray(e) : this
                })
                .filter(function () {
                    var e = this.type;
                    return this.name && !Z(this)
                        .is(":disabled") && St.test(this.nodeName) && !Ct.test(e) && (this.checked || !ke.test(e))
                })
                .map(function (e, t) {
                    var n = Z(this)
                        .val();
                    return null == n ? null : Z.isArray(n) ? Z.map(n, function (e) {
                        return {
                            name: t.name,
                            value: e.replace(Tt, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(Tt, "\r\n")
                    }
                })
                .get()
        }
    }), Z.ajaxSettings.xhr = function () {
        try {
            return new XMLHttpRequest
        } catch (e) {}
    };
    var At = 0,
        Et = {},
        jt = {
            0: 200,
            1223: 204
        },
        Ot = Z.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function () {
        for (var e in Et) Et[e]()
    }), G.cors = !!Ot && "withCredentials" in Ot, G.ajax = Ot = !!Ot, Z.ajaxTransport(function (e) {
        var t;
        return G.cors || Ot && !e.crossDomain ? {
            send: function (n, i) {
                var r, o = e.xhr(),
                    s = ++At;
                if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                    for (r in e.xhrFields) o[r] = e.xhrFields[r];
                e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                for (r in n) o.setRequestHeader(r, n[r]);
                t = function (e) {
                    return function () {
                        t && (delete Et[s],
                            t = o.onload = o.onerror = null, "abort" === e ? o.abort() : "error" === e ? i(o.status, o.statusText) : i(jt[o.status] || o.status, o.statusText, "string" == typeof o.responseText ? {
                                text: o.responseText
                            } : void 0, o.getAllResponseHeaders()))
                    }
                }, o.onload = t(), o.onerror = t("error"), t = Et[s] = t("abort");
                try {
                    o.send(e.hasContent && e.data || null)
                } catch (a) {
                    if (t) throw a
                }
            },
            abort: function () {
                t && t()
            }
        } : void 0
    }), Z.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function (e) {
                return Z.globalEval(e), e
            }
        }
    }), Z.ajaxPrefilter("script", function (e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), Z.ajaxTransport("script", function (e) {
        if (e.crossDomain) {
            var t, n;
            return {
                send: function (i, r) {
                    t = Z("<script>")
                        .prop({
                            async: !0,
                            charset: e.scriptCharset,
                            src: e.url
                        })
                        .on("load error", n = function (e) {
                            t.remove(), n = null, e && r("error" === e.type ? 404 : 200, e.type)
                        }), K.head.appendChild(t[0])
                },
                abort: function () {
                    n && n()
                }
            }
        }
    });
    var Dt = [],
        Nt = /(=)\?(?=&|$)|\?\?/;
    Z.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = Dt.pop() || Z.expando + "_" + ct++;
            return this[e] = !0, e
        }
    }), Z.ajaxPrefilter("json jsonp", function (t, n, i) {
        var r, o, s, a = t.jsonp !== !1 && (Nt.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "")
            .indexOf("application/x-www-form-urlencoded") && Nt.test(t.data) && "data");
        return a || "jsonp" === t.dataTypes[0] ? (r = t.jsonpCallback = Z.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(Nt, "$1" + r) : t.jsonp !== !1 && (t.url += (ut.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function () {
            return s || Z.error(r + " was not called"), s[0]
        }, t.dataTypes[0] = "json", o = e[r], e[r] = function () {
            s = arguments
        }, i.always(function () {
            e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, Dt.push(r)), s && Z.isFunction(o) && o(s[0]), s = o = void 0
        }), "script") : void 0
    }), Z.parseHTML = function (e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || K;
        var i = se.exec(e),
            r = !n && [];
        return i ? [t.createElement(i[1])] : (i = Z.buildFragment([e], t, r), r && r.length && Z(r)
            .remove(), Z.merge([], i.childNodes))
    };
    var It = Z.fn.load;
    Z.fn.load = function (e, t, n) {
        if ("string" != typeof e && It) return It.apply(this, arguments);
        var i, r, o, s = this,
            a = e.indexOf(" ");
        return a >= 0 && (i = Z.trim(e.slice(a)), e = e.slice(0, a)), Z.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (r = "POST"), s.length > 0 && Z.ajax({
                url: e,
                type: r,
                dataType: "html",
                data: t
            })
            .done(function (e) {
                o = arguments, s.html(i ? Z("<div>")
                    .append(Z.parseHTML(e))
                    .find(i) : e)
            })
            .complete(n && function (e, t) {
                s.each(n, o || [e.responseText, t, e])
            }), this
    }, Z.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
        Z.fn[t] = function (e) {
            return this.on(t, e)
        }
    }), Z.expr.filters.animated = function (e) {
        return Z.grep(Z.timers, function (t) {
                return e === t.elem
            })
            .length
    };
    var Pt = e.document.documentElement;
    Z.offset = {
        setOffset: function (e, t, n) {
            var i, r, o, s, a, l, c, u = Z.css(e, "position"),
                d = Z(e),
                p = {};
            "static" === u && (e.style.position = "relative"), a = d.offset(), o = Z.css(e, "top"), l = Z.css(e, "left"), c = ("absolute" === u || "fixed" === u) && (o + l)
                .indexOf("auto") > -1, c ? (i = d.position(), s = i.top, r = i.left) : (s = parseFloat(o) || 0, r = parseFloat(l) || 0), Z.isFunction(t) && (t = t.call(e, n, a)), null != t.top && (p.top = t.top - a.top + s), null != t.left && (p.left = t.left - a.left + r), "using" in t ? t.using.call(e, p) : d.css(p)
        }
    }, Z.fn.extend({
        offset: function (e) {
            if (arguments.length) return void 0 === e ? this : this.each(function (t) {
                Z.offset.setOffset(this, e, t)
            });
            var t, n, i = this[0],
                r = {
                    top: 0,
                    left: 0
                },
                o = i && i.ownerDocument;
            if (o) return t = o.documentElement, Z.contains(t, i) ? (typeof i.getBoundingClientRect !== Te && (r = i.getBoundingClientRect()), n = F(o), {
                top: r.top + n.pageYOffset - t.clientTop,
                left: r.left + n.pageXOffset - t.clientLeft
            }) : r
        },
        position: function () {
            if (this[0]) {
                var e, t, n = this[0],
                    i = {
                        top: 0,
                        left: 0
                    };
                return "fixed" === Z.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), Z.nodeName(e[0], "html") || (i = e.offset()), i.top += Z.css(e[0], "borderTopWidth", !0), i.left += Z.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - i.top - Z.css(n, "marginTop", !0),
                    left: t.left - i.left - Z.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var e = this.offsetParent || Pt; e && !Z.nodeName(e, "html") && "static" === Z.css(e, "position");) e = e.offsetParent;
                return e || Pt
            })
        }
    }), Z.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (t, n) {
        var i = "pageYOffset" === n;
        Z.fn[t] = function (r) {
            return ve(this, function (t, r, o) {
                var s = F(t);
                return void 0 === o ? s ? s[n] : t[r] : void(s ? s.scrollTo(i ? e.pageXOffset : o, i ? o : e.pageYOffset) : t[r] = o)
            }, t, r, arguments.length, null)
        }
    }), Z.each(["top", "left"], function (e, t) {
        Z.cssHooks[t] = _(G.pixelPosition, function (e, n) {
            return n ? (n = x(e, t), ze.test(n) ? Z(e)
                .position()[t] + "px" : n) : void 0
        })
    }), Z.each({
        Height: "height",
        Width: "width"
    }, function (e, t) {
        Z.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function (n, i) {
            Z.fn[i] = function (i, r) {
                var o = arguments.length && (n || "boolean" != typeof i),
                    s = n || (i === !0 || r === !0 ? "margin" : "border");
                return ve(this, function (t, n, i) {
                    var r;
                    return Z.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === i ? Z.css(t, n, s) : Z.style(t, n, i, s)
                }, t, o ? i : void 0, o, null)
            }
        })
    }), Z.fn.size = function () {
        return this.length
    }, Z.fn.andSelf = Z.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
        return Z
    });
    var Lt = e.jQuery,
        Rt = e.$;
    return Z.noConflict = function (t) {
        return e.$ === Z && (e.$ = Rt), t && e.jQuery === Z && (e.jQuery = Lt), Z
    }, typeof t === Te && (e.jQuery = e.$ = Z), Z
}),
function () {
    function e(e, t) {
        if (e !== t) {
            var n = null === e,
                i = e === _,
                r = e === e,
                o = null === t,
                s = t === _,
                a = t === t;
            if (e > t && !o || !r || n && !s && a || i && a) return 1;
            if (t > e && !n || !a || o && !i && r || s && r) return -1
        }
        return 0
    }

    function t(e, t, n) {
        for (var i = e.length, r = n ? i : -1; n ? r-- : ++r < i;)
            if (t(e[r], r, e)) return r;
        return -1
    }

    function n(e, t, n) {
        if (t !== t) return f(e, n);
        for (var i = n - 1, r = e.length; ++i < r;)
            if (e[i] === t) return i;
        return -1
    }

    function i(e) {
        return "function" == typeof e || !1
    }

    function r(e) {
        return null == e ? "" : e + ""
    }

    function o(e, t) {
        for (var n = -1, i = e.length; ++n < i && t.indexOf(e.charAt(n)) > -1;);
        return n
    }

    function s(e, t) {
        for (var n = e.length; n-- && t.indexOf(e.charAt(n)) > -1;);
        return n
    }

    function a(t, n) {
        return e(t.criteria, n.criteria) || t.index - n.index
    }

    function l(t, n, i) {
        for (var r = -1, o = t.criteria, s = n.criteria, a = o.length, l = i.length; ++r < a;) {
            var c = e(o[r], s[r]);
            if (c) {
                if (r >= l) return c;
                var u = i[r];
                return c * ("asc" === u || u === !0 ? 1 : -1)
            }
        }
        return t.index - n.index
    }

    function c(e) {
        return Fe[e]
    }

    function u(e) {
        return ze[e]
    }

    function d(e, t, n) {
        return t ? e = Be[e] : n && (e = Ve[e]), "\\" + e
    }

    function p(e) {
        return "\\" + Ve[e]
    }

    function f(e, t, n) {
        for (var i = e.length, r = t + (n ? 0 : -1); n ? r-- : ++r < i;) {
            var o = e[r];
            if (o !== o) return r
        }
        return -1
    }

    function h(e) {
        return !!e && "object" == typeof e
    }

    function g(e) {
        return 160 >= e && e >= 9 && 13 >= e || 32 == e || 160 == e || 5760 == e || 6158 == e || e >= 8192 && (8202 >= e || 8232 == e || 8233 == e || 8239 == e || 8287 == e || 12288 == e || 65279 == e)
    }

    function v(e, t) {
        for (var n = -1, i = e.length, r = -1, o = []; ++n < i;) e[n] === t && (e[n] = F, o[++r] = n);
        return o
    }

    function m(e, t) {
        for (var n, i = -1, r = e.length, o = -1, s = []; ++i < r;) {
            var a = e[i],
                l = t ? t(a, i, e) : a;
            i && n === l || (n = l, s[++o] = a)
        }
        return s
    }

    function y(e) {
        for (var t = -1, n = e.length; ++t < n && g(e.charCodeAt(t)););
        return t
    }

    function b(e) {
        for (var t = e.length; t-- && g(e.charCodeAt(t)););
        return t
    }

    function w(e) {
        return Ue[e]
    }

    function x(g) {
        function Y(e) {
            if (h(e) && !Ea(e) && !(e instanceof Fe)) {
                if (e instanceof ee) return e;
                if (ts.call(e, "__chain__") && ts.call(e, "__wrapped__")) return fi(e)
            }
            return new ee(e)
        }

        function Q() {}

        function ee(e, t, n) {
            this.__wrapped__ = e, this.__actions__ = n || [], this.__chain__ = !!t
        }

        function Fe(e) {
            this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = As, this.__views__ = []
        }

        function ze() {
            var e = new Fe(this.__wrapped__);
            return e.__actions__ = nt(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = nt(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = nt(this.__views__), e
        }

        function Ue() {
            if (this.__filtered__) {
                var e = new Fe(this);
                e.__dir__ = -1, e.__filtered__ = !0
            } else e = this.clone(), e.__dir__ *= -1;
            return e
        }

        function We() {
            var e = this.__wrapped__.value(),
                t = this.__dir__,
                n = Ea(e),
                i = 0 > t,
                r = n ? e.length : 0,
                o = Vn(0, r, this.__views__),
                s = o.start,
                a = o.end,
                l = a - s,
                c = i ? a : s - 1,
                u = this.__iteratees__,
                d = u.length,
                p = 0,
                f = $s(l, this.__takeCount__);
            if (!n || R > r || r == l && f == l) return nn(e, this.__actions__);
            var h = [];
            e: for (; l-- && f > p;) {
                c += t;
                for (var g = -1, v = e[c]; ++g < d;) {
                    var m = u[g],
                        y = m.iteratee,
                        b = m.type,
                        w = y(v);
                    if (b == M) v = w;
                    else if (!w) {
                        if (b == q) continue e;
                        break e
                    }
                }
                h[p++] = v
            }
            return h
        }

        function Be() {
            this.__data__ = {}
        }

        function Ve(e) {
            return this.has(e) && delete this.__data__[e]
        }

        function Je(e) {
            return "__proto__" == e ? _ : this.__data__[e]
        }

        function Ye(e) {
            return "__proto__" != e && ts.call(this.__data__, e)
        }

        function Xe(e, t) {
            return "__proto__" != e && (this.__data__[e] = t), this
        }

        function Ge(e) {
            var t = e ? e.length : 0;
            for (this.data = {
                    hash: ms(null),
                    set: new ds
                }; t--;) this.push(e[t])
        }

        function Ke(e, t) {
            var n = e.data,
                i = "string" == typeof t || Ir(t) ? n.set.has(t) : n.hash[t];
            return i ? 0 : -1
        }

        function Qe(e) {
            var t = this.data;
            "string" == typeof e || Ir(e) ? t.set.add(e) : t.hash[e] = !0
        }

        function tt(e, t) {
            for (var n = -1, i = e.length, r = -1, o = t.length, s = Fo(i + o); ++n < i;) s[n] = e[n];
            for (; ++r < o;) s[n++] = t[r];
            return s
        }

        function nt(e, t) {
            var n = -1,
                i = e.length;
            for (t || (t = Fo(i)); ++n < i;) t[n] = e[n];
            return t
        }

        function it(e, t) {
            for (var n = -1, i = e.length; ++n < i && t(e[n], n, e) !== !1;);
            return e
        }

        function rt(e, t) {
            for (var n = e.length; n-- && t(e[n], n, e) !== !1;);
            return e
        }

        function ot(e, t) {
            for (var n = -1, i = e.length; ++n < i;)
                if (!t(e[n], n, e)) return !1;
            return !0
        }

        function st(e, t, n, i) {
            for (var r = -1, o = e.length, s = i, a = s; ++r < o;) {
                var l = e[r],
                    c = +t(l);
                n(c, s) && (s = c, a = l)
            }
            return a
        }

        function at(e, t) {
            for (var n = -1, i = e.length, r = -1, o = []; ++n < i;) {
                var s = e[n];
                t(s, n, e) && (o[++r] = s)
            }
            return o
        }

        function lt(e, t) {
            for (var n = -1, i = e.length, r = Fo(i); ++n < i;) r[n] = t(e[n], n, e);
            return r
        }

        function ct(e, t) {
            for (var n = -1, i = t.length, r = e.length; ++n < i;) e[r + n] = t[n];
            return e
        }

        function ut(e, t, n, i) {
            var r = -1,
                o = e.length;
            for (i && o && (n = e[++r]); ++r < o;) n = t(n, e[r], r, e);
            return n
        }

        function dt(e, t, n, i) {
            var r = e.length;
            for (i && r && (n = e[--r]); r--;) n = t(n, e[r], r, e);
            return n
        }

        function pt(e, t) {
            for (var n = -1, i = e.length; ++n < i;)
                if (t(e[n], n, e)) return !0;
            return !1
        }

        function ft(e, t) {
            for (var n = e.length, i = 0; n--;) i += +t(e[n]) || 0;
            return i
        }

        function ht(e, t) {
            return e === _ ? t : e
        }

        function gt(e, t, n, i) {
            return e !== _ && ts.call(i, n) ? e : t
        }

        function vt(e, t, n) {
            for (var i = -1, r = Ha(t), o = r.length; ++i < o;) {
                var s = r[i],
                    a = e[s],
                    l = n(a, t[s], s, e, t);
                (l === l ? l === a : a !== a) && (a !== _ || s in e) || (e[s] = l)
            }
            return e
        }

        function mt(e, t) {
            return null == t ? e : bt(t, Ha(t), e)
        }

        function yt(e, t) {
            for (var n = -1, i = null == e, r = !i && Kn(e), o = r ? e.length : 0, s = t.length, a = Fo(s); ++n < s;) {
                var l = t[n];
                r ? a[n] = Qn(l, o) ? e[l] : _ : a[n] = i ? _ : e[l]
            }
            return a
        }

        function bt(e, t, n) {
            n || (n = {});
            for (var i = -1, r = t.length; ++i < r;) {
                var o = t[i];
                n[o] = e[o]
            }
            return n
        }

        function wt(e, t, n) {
            var i = typeof e;
            return "function" == i ? t === _ ? e : sn(e, t, n) : null == e ? Ao : "object" == i ? Mt(e) : t === _ ? Io(e) : Ht(e, t)
        }

        function xt(e, t, n, i, r, o, s) {
            var a;
            if (n && (a = r ? n(e, i, r) : n(e)), a !== _) return a;
            if (!Ir(e)) return e;
            var l = Ea(e);
            if (l) {
                if (a = Jn(e), !t) return nt(e, a)
            } else {
                var c = is.call(e),
                    u = c == J;
                if (c != G && c != z && (!u || r)) return He[c] ? Xn(e, c, t) : r ? e : {};
                if (a = Yn(u ? {} : e), !t) return mt(a, e)
            }
            o || (o = []), s || (s = []);
            for (var d = o.length; d--;)
                if (o[d] == e) return s[d];
            return o.push(e), s.push(a), (l ? it : Ot)(e, function (i, r) {
                a[r] = xt(i, t, n, r, e, o, s)
            }), a
        }

        function _t(e, t, n) {
            if ("function" != typeof e) throw new Go(H);
            return ps(function () {
                e.apply(_, n)
            }, t)
        }

        function $t(e, t) {
            var i = e ? e.length : 0,
                r = [];
            if (!i) return r;
            var o = -1,
                s = Un(),
                a = s === n,
                l = a && t.length >= R ? gn(t) : null,
                c = t.length;
            l && (s = Ke, a = !1, t = l);
            e: for (; ++o < i;) {
                var u = e[o];
                if (a && u === u) {
                    for (var d = c; d--;)
                        if (t[d] === u) continue e;
                    r.push(u)
                } else s(t, u, 0) < 0 && r.push(u)
            }
            return r
        }

        function kt(e, t) {
            var n = !0;
            return Ls(e, function (e, i, r) {
                return n = !!t(e, i, r)
            }), n
        }

        function Tt(e, t, n, i) {
            var r = i,
                o = r;
            return Ls(e, function (e, s, a) {
                var l = +t(e, s, a);
                (n(l, r) || l === i && l === o) && (r = l, o = e)
            }), o
        }

        function Ct(e, t, n, i) {
            var r = e.length;
            for (n = null == n ? 0 : +n || 0, 0 > n && (n = -n > r ? 0 : r + n), i = i === _ || i > r ? r : +i || 0, 0 > i && (i += r), r = n > i ? 0 : i >>> 0, n >>>= 0; r > n;) e[n++] = t;
            return e
        }

        function St(e, t) {
            var n = [];
            return Ls(e, function (e, i, r) {
                t(e, i, r) && n.push(e)
            }), n
        }

        function At(e, t, n, i) {
            var r;
            return n(e, function (e, n, o) {
                return t(e, n, o) ? (r = i ? n : e, !1) : void 0
            }), r
        }

        function Et(e, t, n, i) {
            i || (i = []);
            for (var r = -1, o = e.length; ++r < o;) {
                var s = e[r];
                h(s) && Kn(s) && (n || Ea(s) || Tr(s)) ? t ? Et(s, t, n, i) : ct(i, s) : n || (i[i.length] = s)
            }
            return i
        }

        function jt(e, t) {
            return qs(e, t, eo)
        }

        function Ot(e, t) {
            return qs(e, t, Ha)
        }

        function Dt(e, t) {
            return Ms(e, t, Ha)
        }

        function Nt(e, t) {
            for (var n = -1, i = t.length, r = -1, o = []; ++n < i;) {
                var s = t[n];
                Nr(e[s]) && (o[++r] = s)
            }
            return o
        }

        function It(e, t, n) {
            if (null != e) {
                n !== _ && n in di(e) && (t = [n]);
                for (var i = 0, r = t.length; null != e && r > i;) e = e[t[i++]];
                return i && i == r ? e : _
            }
        }

        function Pt(e, t, n, i, r, o) {
            return e === t ? !0 : null == e || null == t || !Ir(e) && !h(t) ? e !== e && t !== t : Lt(e, t, Pt, n, i, r, o)
        }

        function Lt(e, t, n, i, r, o, s) {
            var a = Ea(e),
                l = Ea(t),
                c = U,
                u = U;
            a || (c = is.call(e), c == z ? c = G : c != G && (a = Ur(e))), l || (u = is.call(t), u == z ? u = G : u != G && (l = Ur(t)));
            var d = c == G,
                p = u == G,
                f = c == u;
            if (f && !a && !d) return Mn(e, t, c);
            if (!r) {
                var h = d && ts.call(e, "__wrapped__"),
                    g = p && ts.call(t, "__wrapped__");
                if (h || g) return n(h ? e.value() : e, g ? t.value() : t, i, r, o, s)
            }
            if (!f) return !1;
            o || (o = []), s || (s = []);
            for (var v = o.length; v--;)
                if (o[v] == e) return s[v] == t;
            o.push(e), s.push(t);
            var m = (a ? qn : Hn)(e, t, n, i, r, o, s);
            return o.pop(), s.pop(), m
        }

        function Rt(e, t, n) {
            var i = t.length,
                r = i,
                o = !n;
            if (null == e) return !r;
            for (e = di(e); i--;) {
                var s = t[i];
                if (o && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1
            }
            for (; ++i < r;) {
                s = t[i];
                var a = s[0],
                    l = e[a],
                    c = s[1];
                if (o && s[2]) {
                    if (l === _ && !(a in e)) return !1
                } else {
                    var u = n ? n(l, c, a) : _;
                    if (!(u === _ ? Pt(c, l, n, !0) : u)) return !1
                }
            }
            return !0
        }

        function qt(e, t) {
            var n = -1,
                i = Kn(e) ? Fo(e.length) : [];
            return Ls(e, function (e, r, o) {
                i[++n] = t(e, r, o)
            }), i
        }

        function Mt(e) {
            var t = Wn(e);
            if (1 == t.length && t[0][2]) {
                var n = t[0][0],
                    i = t[0][1];
                return function (e) {
                    return null == e ? !1 : e[n] === i && (i !== _ || n in di(e))
                }
            }
            return function (e) {
                return Rt(e, t)
            }
        }

        function Ht(e, t) {
            var n = Ea(e),
                i = ei(e) && ii(t),
                r = e + "";
            return e = pi(e),
                function (o) {
                    if (null == o) return !1;
                    var s = r;
                    if (o = di(o), (n || !i) && !(s in o)) {
                        if (o = 1 == e.length ? o : It(o, Yt(e, 0, -1)), null == o) return !1;
                        s = Ci(e), o = di(o)
                    }
                    return o[s] === t ? t !== _ || s in o : Pt(t, o[s], _, !0)
                }
        }

        function Ft(e, t, n, i, r) {
            if (!Ir(e)) return e;
            var o = Kn(t) && (Ea(t) || Ur(t)),
                s = o ? _ : Ha(t);
            return it(s || t, function (a, l) {
                if (s && (l = a, a = t[l]), h(a)) i || (i = []), r || (r = []), zt(e, t, l, Ft, n, i, r);
                else {
                    var c = e[l],
                        u = n ? n(c, a, l, e, t) : _,
                        d = u === _;
                    d && (u = a), u === _ && (!o || l in e) || !d && (u === u ? u === c : c !== c) || (e[l] = u)
                }
            }), e
        }

        function zt(e, t, n, i, r, o, s) {
            for (var a = o.length, l = t[n]; a--;)
                if (o[a] == l) return void(e[n] = s[a]);
            var c = e[n],
                u = r ? r(c, l, n, e, t) : _,
                d = u === _;
            d && (u = l, Kn(l) && (Ea(l) || Ur(l)) ? u = Ea(c) ? c : Kn(c) ? nt(c) : [] : Hr(l) || Tr(l) ? u = Tr(c) ? Yr(c) : Hr(c) ? c : {} : d = !1), o.push(l), s.push(u), d ? e[n] = i(u, l, r, o, s) : (u === u ? u !== c : c === c) && (e[n] = u)
        }

        function Ut(e) {
            return function (t) {
                return null == t ? _ : t[e]
            }
        }

        function Wt(e) {
            var t = e + "";
            return e = pi(e),
                function (n) {
                    return It(n, e, t)
                }
        }

        function Bt(e, t) {
            for (var n = e ? t.length : 0; n--;) {
                var i = t[n];
                if (i != r && Qn(i)) {
                    var r = i;
                    fs.call(e, i, 1)
                }
            }
            return e
        }

        function Vt(e, t) {
            return e + ys(Cs() * (t - e + 1))
        }

        function Jt(e, t, n, i, r) {
            return r(e, function (e, r, o) {
                n = i ? (i = !1, e) : t(n, e, r, o)
            }), n
        }

        function Yt(e, t, n) {
            var i = -1,
                r = e.length;
            t = null == t ? 0 : +t || 0, 0 > t && (t = -t > r ? 0 : r + t), n = n === _ || n > r ? r : +n || 0, 0 > n && (n += r), r = t > n ? 0 : n - t >>> 0, t >>>= 0;
            for (var o = Fo(r); ++i < r;) o[i] = e[i + t];
            return o
        }

        function Xt(e, t) {
            var n;
            return Ls(e, function (e, i, r) {
                return n = t(e, i, r), !n
            }), !!n
        }

        function Gt(e, t) {
            var n = e.length;
            for (e.sort(t); n--;) e[n] = e[n].value;
            return e
        }

        function Kt(e, t, n) {
            var i = Fn(),
                r = -1;
            t = lt(t, function (e) {
                return i(e)
            });
            var o = qt(e, function (e) {
                var n = lt(t, function (t) {
                    return t(e)
                });
                return {
                    criteria: n,
                    index: ++r,
                    value: e
                }
            });
            return Gt(o, function (e, t) {
                return l(e, t, n)
            })
        }

        function Qt(e, t) {
            var n = 0;
            return Ls(e, function (e, i, r) {
                n += +t(e, i, r) || 0
            }), n
        }

        function Zt(e, t) {
            var i = -1,
                r = Un(),
                o = e.length,
                s = r === n,
                a = s && o >= R,
                l = a ? gn() : null,
                c = [];
            l ? (r = Ke, s = !1) : (a = !1, l = t ? [] : c);
            e: for (; ++i < o;) {
                var u = e[i],
                    d = t ? t(u, i, e) : u;
                if (s && u === u) {
                    for (var p = l.length; p--;)
                        if (l[p] === d) continue e;
                    t && l.push(d), c.push(u)
                } else r(l, d, 0) < 0 && ((t || a) && l.push(d), c.push(u))
            }
            return c
        }

        function en(e, t) {
            for (var n = -1, i = t.length, r = Fo(i); ++n < i;) r[n] = e[t[n]];
            return r
        }

        function tn(e, t, n, i) {
            for (var r = e.length, o = i ? r : -1;
                (i ? o-- : ++o < r) && t(e[o], o, e););
            return n ? Yt(e, i ? 0 : o, i ? o + 1 : r) : Yt(e, i ? o + 1 : 0, i ? r : o)
        }

        function nn(e, t) {
            var n = e;
            n instanceof Fe && (n = n.value());
            for (var i = -1, r = t.length; ++i < r;) {
                var o = t[i];
                n = o.func.apply(o.thisArg, ct([n], o.args))
            }
            return n
        }

        function rn(e, t, n) {
            var i = 0,
                r = e ? e.length : i;
            if ("number" == typeof t && t === t && Os >= r) {
                for (; r > i;) {
                    var o = i + r >>> 1,
                        s = e[o];
                    (n ? t >= s : t > s) && null !== s ? i = o + 1 : r = o
                }
                return r
            }
            return on(e, t, Ao, n)
        }

        function on(e, t, n, i) {
            t = n(t);
            for (var r = 0, o = e ? e.length : 0, s = t !== t, a = null === t, l = t === _; o > r;) {
                var c = ys((r + o) / 2),
                    u = n(e[c]),
                    d = u !== _,
                    p = u === u;
                if (s) var f = p || i;
                else f = a ? p && d && (i || null != u) : l ? p && (i || d) : null == u ? !1 : i ? t >= u : t > u;
                f ? r = c + 1 : o = c
            }
            return $s(o, js)
        }

        function sn(e, t, n) {
            if ("function" != typeof e) return Ao;
            if (t === _) return e;
            switch (n) {
            case 1:
                return function (n) {
                    return e.call(t, n)
                };
            case 3:
                return function (n, i, r) {
                    return e.call(t, n, i, r)
                };
            case 4:
                return function (n, i, r, o) {
                    return e.call(t, n, i, r, o)
                };
            case 5:
                return function (n, i, r, o, s) {
                    return e.call(t, n, i, r, o, s)
                }
            }
            return function () {
                return e.apply(t, arguments)
            }
        }

        function an(e) {
            var t = new ss(e.byteLength),
                n = new hs(t);
            return n.set(new hs(e)), t
        }

        function ln(e, t, n) {
            for (var i = n.length, r = -1, o = _s(e.length - i, 0), s = -1, a = t.length, l = Fo(a + o); ++s < a;) l[s] = t[s];
            for (; ++r < i;) l[n[r]] = e[r];
            for (; o--;) l[s++] = e[r++];
            return l
        }

        function cn(e, t, n) {
            for (var i = -1, r = n.length, o = -1, s = _s(e.length - r, 0), a = -1, l = t.length, c = Fo(s + l); ++o < s;) c[o] = e[o];
            for (var u = o; ++a < l;) c[u + a] = t[a];
            for (; ++i < r;) c[u + n[i]] = e[o++];
            return c
        }

        function un(e, t) {
            return function (n, i, r) {
                var o = t ? t() : {};
                if (i = Fn(i, r, 3), Ea(n))
                    for (var s = -1, a = n.length; ++s < a;) {
                        var l = n[s];
                        e(o, l, i(l, s, n), n)
                    } else Ls(n, function (t, n, r) {
                        e(o, t, i(t, n, r), r)
                    });
                return o
            }
        }

        function dn(e) {
            return mr(function (t, n) {
                var i = -1,
                    r = null == t ? 0 : n.length,
                    o = r > 2 ? n[r - 2] : _,
                    s = r > 2 ? n[2] : _,
                    a = r > 1 ? n[r - 1] : _;
                for ("function" == typeof o ? (o = sn(o, a, 5), r -= 2) : (o = "function" == typeof a ? a : _, r -= o ? 1 : 0), s && Zn(n[0], n[1], s) && (o = 3 > r ? _ : o, r = 1); ++i < r;) {
                    var l = n[i];
                    l && e(t, l, o)
                }
                return t
            })
        }

        function pn(e, t) {
            return function (n, i) {
                var r = n ? zs(n) : 0;
                if (!ni(r)) return e(n, i);
                for (var o = t ? r : -1, s = di(n);
                    (t ? o-- : ++o < r) && i(s[o], o, s) !== !1;);
                return n
            }
        }

        function fn(e) {
            return function (t, n, i) {
                for (var r = di(t), o = i(t), s = o.length, a = e ? s : -1; e ? a-- : ++a < s;) {
                    var l = o[a];
                    if (n(r[l], l, r) === !1) break
                }
                return t
            }
        }

        function hn(e, t) {
            function n() {
                var r = this && this !== Ze && this instanceof n ? i : e;
                return r.apply(t, arguments)
            }
            var i = mn(e);
            return n
        }

        function gn(e) {
            return ms && ds ? new Ge(e) : null
        }

        function vn(e) {
            return function (t) {
                for (var n = -1, i = To(uo(t)), r = i.length, o = ""; ++n < r;) o = e(o, i[n], n);
                return o
            }
        }

        function mn(e) {
            return function () {
                var t = arguments;
                switch (t.length) {
                case 0:
                    return new e;
                case 1:
                    return new e(t[0]);
                case 2:
                    return new e(t[0], t[1]);
                case 3:
                    return new e(t[0], t[1], t[2]);
                case 4:
                    return new e(t[0], t[1], t[2], t[3]);
                case 5:
                    return new e(t[0], t[1], t[2], t[3], t[4]);
                case 6:
                    return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
                case 7:
                    return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6])
                }
                var n = Ps(e.prototype),
                    i = e.apply(n, t);
                return Ir(i) ? i : n
            }
        }

        function yn(e) {
            function t(n, i, r) {
                r && Zn(n, i, r) && (i = _);
                var o = Rn(n, e, _, _, _, _, _, i);
                return o.placeholder = t.placeholder, o
            }
            return t
        }

        function bn(e, t) {
            return mr(function (n) {
                var i = n[0];
                return null == i ? i : (n.push(t), e.apply(_, n))
            })
        }

        function wn(e, t) {
            return function (n, i, r) {
                if (r && Zn(n, i, r) && (i = _), i = Fn(i, r, 3), 1 == i.length) {
                    n = Ea(n) ? n : ui(n);
                    var o = st(n, i, e, t);
                    if (!n.length || o !== t) return o
                }
                return Tt(n, i, e, t)
            }
        }

        function xn(e, n) {
            return function (i, r, o) {
                if (r = Fn(r, o, 3), Ea(i)) {
                    var s = t(i, r, n);
                    return s > -1 ? i[s] : _
                }
                return At(i, r, e)
            }
        }

        function _n(e) {
            return function (n, i, r) {
                return n && n.length ? (i = Fn(i, r, 3), t(n, i, e)) : -1
            }
        }

        function $n(e) {
            return function (t, n, i) {
                return n = Fn(n, i, 3), At(t, n, e, !0)
            }
        }

        function kn(e) {
            return function () {
                for (var t, n = arguments.length, i = e ? n : -1, r = 0, o = Fo(n); e ? i-- : ++i < n;) {
                    var s = o[r++] = arguments[i];
                    if ("function" != typeof s) throw new Go(H);
                    !t && ee.prototype.thru && "wrapper" == zn(s) && (t = new ee([], !0))
                }
                for (i = t ? -1 : n; ++i < n;) {
                    s = o[i];
                    var a = zn(s),
                        l = "wrapper" == a ? Fs(s) : _;
                    t = l && ti(l[0]) && l[1] == (O | S | E | D) && !l[4].length && 1 == l[9] ? t[zn(l[0])].apply(t, l[3]) : 1 == s.length && ti(s) ? t[a]() : t.thru(s)
                }
                return function () {
                    var e = arguments,
                        i = e[0];
                    if (t && 1 == e.length && Ea(i) && i.length >= R) return t.plant(i)
                        .value();
                    for (var r = 0, s = n ? o[r].apply(this, e) : i; ++r < n;) s = o[r].call(this, s);
                    return s
                }
            }
        }

        function Tn(e, t) {
            return function (n, i, r) {
                return "function" == typeof i && r === _ && Ea(n) ? e(n, i) : t(n, sn(i, r, 3))
            }
        }

        function Cn(e) {
            return function (t, n, i) {
                return ("function" != typeof n || i !== _) && (n = sn(n, i, 3)), e(t, n, eo)
            }
        }

        function Sn(e) {
            return function (t, n, i) {
                return ("function" != typeof n || i !== _) && (n = sn(n, i, 3)), e(t, n)
            }
        }

        function An(e) {
            return function (t, n, i) {
                var r = {};
                return n = Fn(n, i, 3), Ot(t, function (t, i, o) {
                    var s = n(t, i, o);
                    i = e ? s : i, t = e ? t : s, r[i] = t
                }), r
            }
        }

        function En(e) {
            return function (t, n, i) {
                return t = r(t), (e ? t : "") + Nn(t, n, i) + (e ? "" : t)
            }
        }

        function jn(e) {
            var t = mr(function (n, i) {
                var r = v(i, t.placeholder);
                return Rn(n, e, _, i, r)
            });
            return t
        }

        function On(e, t) {
            return function (n, i, r, o) {
                var s = arguments.length < 3;
                return "function" == typeof i && o === _ && Ea(n) ? e(n, i, r, s) : Jt(n, Fn(i, o, 4), r, s, t)
            }
        }

        function Dn(e, t, n, i, r, o, s, a, l, c) {
            function u() {
                for (var b = arguments.length, w = b, x = Fo(b); w--;) x[w] = arguments[w];
                if (i && (x = ln(x, i, r)), o && (x = cn(x, o, s)), h || m) {
                    var $ = u.placeholder,
                        C = v(x, $);
                    if (b -= C.length, c > b) {
                        var S = a ? nt(a) : _,
                            A = _s(c - b, 0),
                            O = h ? C : _,
                            D = h ? _ : C,
                            N = h ? x : _,
                            I = h ? _ : x;
                        t |= h ? E : j, t &= ~(h ? j : E), g || (t &= ~(k | T));
                        var P = [e, t, n, N, O, I, D, S, l, A],
                            L = Dn.apply(_, P);
                        return ti(e) && Us(L, P), L.placeholder = $, L
                    }
                }
                var R = p ? n : this,
                    q = f ? R[e] : e;
                return a && (x = li(x, a)), d && l < x.length && (x.length = l), this && this !== Ze && this instanceof u && (q = y || mn(e)), q.apply(R, x)
            }
            var d = t & O,
                p = t & k,
                f = t & T,
                h = t & S,
                g = t & C,
                m = t & A,
                y = f ? _ : mn(e);
            return u
        }

        function Nn(e, t, n) {
            var i = e.length;
            if (t = +t, i >= t || !ws(t)) return "";
            var r = t - i;
            return n = null == n ? " " : n + "", mo(n, vs(r / n.length))
                .slice(0, r)
        }

        function In(e, t, n, i) {
            function r() {
                for (var t = -1, a = arguments.length, l = -1, c = i.length, u = Fo(c + a); ++l < c;) u[l] = i[l];
                for (; a--;) u[l++] = arguments[++t];
                var d = this && this !== Ze && this instanceof r ? s : e;
                return d.apply(o ? n : this, u)
            }
            var o = t & k,
                s = mn(e);
            return r
        }

        function Pn(e) {
            var t = Bo[e];
            return function (e, n) {
                return n = n === _ ? 0 : +n || 0, n ? (n = cs(10, n), t(e * n) / n) : t(e)
            }
        }

        function Ln(e) {
            return function (t, n, i, r) {
                var o = Fn(i);
                return null == i && o === wt ? rn(t, n, e) : on(t, n, o(i, r, 1), e)
            }
        }

        function Rn(e, t, n, i, r, o, s, a) {
            var l = t & T;
            if (!l && "function" != typeof e) throw new Go(H);
            var c = i ? i.length : 0;
            if (c || (t &= ~(E | j), i = r = _), c -= r ? r.length : 0, t & j) {
                var u = i,
                    d = r;
                i = r = _
            }
            var p = l ? _ : Fs(e),
                f = [e, t, n, i, r, u, d, o, s, a];
            if (p && (ri(f, p), t = f[1], a = f[9]), f[9] = null == a ? l ? 0 : e.length : _s(a - c, 0) || 0, t == k) var h = hn(f[0], f[2]);
            else h = t != E && t != (k | E) || f[4].length ? Dn.apply(_, f) : In.apply(_, f);
            var g = p ? Hs : Us;
            return g(h, f)
        }

        function qn(e, t, n, i, r, o, s) {
            var a = -1,
                l = e.length,
                c = t.length;
            if (l != c && !(r && c > l)) return !1;
            for (; ++a < l;) {
                var u = e[a],
                    d = t[a],
                    p = i ? i(r ? d : u, r ? u : d, a) : _;
                if (p !== _) {
                    if (p) continue;
                    return !1
                }
                if (r) {
                    if (!pt(t, function (e) {
                            return u === e || n(u, e, i, r, o, s)
                        })) return !1
                } else if (u !== d && !n(u, d, i, r, o, s)) return !1
            }
            return !0
        }

        function Mn(e, t, n) {
            switch (n) {
            case W:
            case B:
                return +e == +t;
            case V:
                return e.name == t.name && e.message == t.message;
            case X:
                return e != +e ? t != +t : e == +t;
            case K:
            case Z:
                return e == t + ""
            }
            return !1
        }

        function Hn(e, t, n, i, r, o, s) {
            var a = Ha(e),
                l = a.length,
                c = Ha(t),
                u = c.length;
            if (l != u && !r) return !1;
            for (var d = l; d--;) {
                var p = a[d];
                if (!(r ? p in t : ts.call(t, p))) return !1
            }
            for (var f = r; ++d < l;) {
                p = a[d];
                var h = e[p],
                    g = t[p],
                    v = i ? i(r ? g : h, r ? h : g, p) : _;
                if (!(v === _ ? n(h, g, i, r, o, s) : v)) return !1;
                f || (f = "constructor" == p)
            }
            if (!f) {
                var m = e.constructor,
                    y = t.constructor;
                if (m != y && "constructor" in e && "constructor" in t && !("function" == typeof m && m instanceof m && "function" == typeof y && y instanceof y)) return !1
            }
            return !0
        }

        function Fn(e, t, n) {
            var i = Y.callback || Co;
            return i = i === Co ? wt : i, n ? i(e, t, n) : i
        }

        function zn(e) {
            for (var t = e.name + "", n = Is[t], i = n ? n.length : 0; i--;) {
                var r = n[i],
                    o = r.func;
                if (null == o || o == e) return r.name
            }
            return t
        }

        function Un(e, t, i) {
            var r = Y.indexOf || ki;
            return r = r === ki ? n : r, e ? r(e, t, i) : r
        }

        function Wn(e) {
            for (var t = to(e), n = t.length; n--;) t[n][2] = ii(t[n][1]);
            return t
        }

        function Bn(e, t) {
            var n = null == e ? _ : e[t];
            return Rr(n) ? n : _
        }

        function Vn(e, t, n) {
            for (var i = -1, r = n.length; ++i < r;) {
                var o = n[i],
                    s = o.size;
                switch (o.type) {
                case "drop":
                    e += s;
                    break;
                case "dropRight":
                    t -= s;
                    break;
                case "take":
                    t = $s(t, e + s);
                    break;
                case "takeRight":
                    e = _s(e, t - s)
                }
            }
            return {
                start: e,
                end: t
            }
        }

        function Jn(e) {
            var t = e.length,
                n = new e.constructor(t);
            return t && "string" == typeof e[0] && ts.call(e, "index") && (n.index = e.index, n.input = e.input), n
        }

        function Yn(e) {
            var t = e.constructor;
            return "function" == typeof t && t instanceof t || (t = Jo), new t
        }

        function Xn(e, t, n) {
            var i = e.constructor;
            switch (t) {
            case te:
                return an(e);
            case W:
            case B:
                return new i(+e);
            case ne:
            case ie:
            case re:
            case oe:
            case se:
            case ae:
            case le:
            case ce:
            case ue:
                var r = e.buffer;
                return new i(n ? an(r) : r, e.byteOffset, e.length);
            case X:
            case Z:
                return new i(e);
            case K:
                var o = new i(e.source, Ee.exec(e));
                o.lastIndex = e.lastIndex
            }
            return o
        }

        function Gn(e, t, n) {
            null == e || ei(t, e) || (t = pi(t), e = 1 == t.length ? e : It(e, Yt(t, 0, -1)), t = Ci(t));
            var i = null == e ? e : e[t];
            return null == i ? _ : i.apply(e, n)
        }

        function Kn(e) {
            return null != e && ni(zs(e))
        }

        function Qn(e, t) {
            return e = "number" == typeof e || De.test(e) ? +e : -1, t = null == t ? Ds : t, e > -1 && e % 1 == 0 && t > e
        }

        function Zn(e, t, n) {
            if (!Ir(n)) return !1;
            var i = typeof t;
            if ("number" == i ? Kn(n) && Qn(t, n.length) : "string" == i && t in n) {
                var r = n[t];
                return e === e ? e === r : r !== r
            }
            return !1
        }

        function ei(e, t) {
            var n = typeof e;
            if ("string" == n && _e.test(e) || "number" == n) return !0;
            if (Ea(e)) return !1;
            var i = !xe.test(e);
            return i || null != t && e in di(t)
        }

        function ti(e) {
            var t = zn(e),
                n = Y[t];
            if ("function" != typeof n || !(t in Fe.prototype)) return !1;
            if (e === n) return !0;
            var i = Fs(n);
            return !!i && e === i[0]
        }

        function ni(e) {
            return "number" == typeof e && e > -1 && e % 1 == 0 && Ds >= e
        }

        function ii(e) {
            return e === e && !Ir(e)
        }

        function ri(e, t) {
            var n = e[1],
                i = t[1],
                r = n | i,
                o = O > r,
                s = i == O && n == S || i == O && n == D && e[7].length <= t[8] || i == (O | D) && n == S;
            if (!o && !s) return e;
            i & k && (e[2] = t[2], r |= n & k ? 0 : C);
            var a = t[3];
            if (a) {
                var l = e[3];
                e[3] = l ? ln(l, a, t[4]) : nt(a), e[4] = l ? v(e[3], F) : nt(t[4])
            }
            return a = t[5], a && (l = e[5], e[5] = l ? cn(l, a, t[6]) : nt(a), e[6] = l ? v(e[5], F) : nt(t[6])), a = t[7], a && (e[7] = nt(a)), i & O && (e[8] = null == e[8] ? t[8] : $s(e[8], t[8])), null == e[9] && (e[9] = t[9]), e[0] = t[0], e[1] = r, e
        }

        function oi(e, t) {
            return e === _ ? t : ja(e, t, oi)
        }

        function si(e, t) {
            e = di(e);
            for (var n = -1, i = t.length, r = {}; ++n < i;) {
                var o = t[n];
                o in e && (r[o] = e[o])
            }
            return r
        }

        function ai(e, t) {
            var n = {};
            return jt(e, function (e, i, r) {
                t(e, i, r) && (n[i] = e)
            }), n
        }

        function li(e, t) {
            for (var n = e.length, i = $s(t.length, n), r = nt(e); i--;) {
                var o = t[i];
                e[i] = Qn(o, n) ? r[o] : _
            }
            return e
        }

        function ci(e) {
            for (var t = eo(e), n = t.length, i = n && e.length, r = !!i && ni(i) && (Ea(e) || Tr(e)), o = -1, s = []; ++o < n;) {
                var a = t[o];
                (r && Qn(a, i) || ts.call(e, a)) && s.push(a)
            }
            return s
        }

        function ui(e) {
            return null == e ? [] : Kn(e) ? Ir(e) ? e : Jo(e) : oo(e)
        }

        function di(e) {
            return Ir(e) ? e : Jo(e)
        }

        function pi(e) {
            if (Ea(e)) return e;
            var t = [];
            return r(e)
                .replace($e, function (e, n, i, r) {
                    t.push(i ? r.replace(Se, "$1") : n || e)
                }), t
        }

        function fi(e) {
            return e instanceof Fe ? e.clone() : new ee(e.__wrapped__, e.__chain__, nt(e.__actions__))
        }

        function hi(e, t, n) {
            t = (n ? Zn(e, t, n) : null == t) ? 1 : _s(ys(t) || 1, 1);
            for (var i = 0, r = e ? e.length : 0, o = -1, s = Fo(vs(r / t)); r > i;) s[++o] = Yt(e, i, i += t);
            return s
        }

        function gi(e) {
            for (var t = -1, n = e ? e.length : 0, i = -1, r = []; ++t < n;) {
                var o = e[t];
                o && (r[++i] = o)
            }
            return r
        }

        function vi(e, t, n) {
            var i = e ? e.length : 0;
            return i ? ((n ? Zn(e, t, n) : null == t) && (t = 1), Yt(e, 0 > t ? 0 : t)) : []
        }

        function mi(e, t, n) {
            var i = e ? e.length : 0;
            return i ? ((n ? Zn(e, t, n) : null == t) && (t = 1), t = i - (+t || 0), Yt(e, 0, 0 > t ? 0 : t)) : []
        }

        function yi(e, t, n) {
            return e && e.length ? tn(e, Fn(t, n, 3), !0, !0) : []
        }

        function bi(e, t, n) {
            return e && e.length ? tn(e, Fn(t, n, 3), !0) : []
        }

        function wi(e, t, n, i) {
            var r = e ? e.length : 0;
            return r ? (n && "number" != typeof n && Zn(e, t, n) && (n = 0, i = r), Ct(e, t, n, i)) : []
        }

        function xi(e) {
            return e ? e[0] : _
        }

        function _i(e, t, n) {
            var i = e ? e.length : 0;
            return n && Zn(e, t, n) && (t = !1), i ? Et(e, t) : []
        }

        function $i(e) {
            var t = e ? e.length : 0;
            return t ? Et(e, !0) : []
        }

        function ki(e, t, i) {
            var r = e ? e.length : 0;
            if (!r) return -1;
            if ("number" == typeof i) i = 0 > i ? _s(r + i, 0) : i;
            else if (i) {
                var o = rn(e, t);
                return r > o && (t === t ? t === e[o] : e[o] !== e[o]) ? o : -1
            }
            return n(e, t, i || 0)
        }

        function Ti(e) {
            return mi(e, 1)
        }

        function Ci(e) {
            var t = e ? e.length : 0;
            return t ? e[t - 1] : _
        }

        function Si(e, t, n) {
            var i = e ? e.length : 0;
            if (!i) return -1;
            var r = i;
            if ("number" == typeof n) r = (0 > n ? _s(i + n, 0) : $s(n || 0, i - 1)) + 1;
            else if (n) {
                r = rn(e, t, !0) - 1;
                var o = e[r];
                return (t === t ? t === o : o !== o) ? r : -1
            }
            if (t !== t) return f(e, r, !0);
            for (; r--;)
                if (e[r] === t) return r;
            return -1
        }

        function Ai() {
            var e = arguments,
                t = e[0];
            if (!t || !t.length) return t;
            for (var n = 0, i = Un(), r = e.length; ++n < r;)
                for (var o = 0, s = e[n];
                    (o = i(t, s, o)) > -1;) fs.call(t, o, 1);
            return t
        }

        function Ei(e, t, n) {
            var i = [];
            if (!e || !e.length) return i;
            var r = -1,
                o = [],
                s = e.length;
            for (t = Fn(t, n, 3); ++r < s;) {
                var a = e[r];
                t(a, r, e) && (i.push(a), o.push(r))
            }
            return Bt(e, o), i
        }

        function ji(e) {
            return vi(e, 1)
        }

        function Oi(e, t, n) {
            var i = e ? e.length : 0;
            return i ? (n && "number" != typeof n && Zn(e, t, n) && (t = 0, n = i), Yt(e, t, n)) : []
        }

        function Di(e, t, n) {
            var i = e ? e.length : 0;
            return i ? ((n ? Zn(e, t, n) : null == t) && (t = 1), Yt(e, 0, 0 > t ? 0 : t)) : []
        }

        function Ni(e, t, n) {
            var i = e ? e.length : 0;
            return i ? ((n ? Zn(e, t, n) : null == t) && (t = 1), t = i - (+t || 0), Yt(e, 0 > t ? 0 : t)) : []
        }

        function Ii(e, t, n) {
            return e && e.length ? tn(e, Fn(t, n, 3), !1, !0) : []
        }

        function Pi(e, t, n) {
            return e && e.length ? tn(e, Fn(t, n, 3)) : []
        }

        function Li(e, t, i, r) {
            var o = e ? e.length : 0;
            if (!o) return [];
            null != t && "boolean" != typeof t && (r = i, i = Zn(e, t, r) ? _ : t, t = !1);
            var s = Fn();
            return (null != i || s !== wt) && (i = s(i, r, 3)), t && Un() === n ? m(e, i) : Zt(e, i)
        }

        function Ri(e) {
            if (!e || !e.length) return [];
            var t = -1,
                n = 0;
            e = at(e, function (e) {
                return Kn(e) ? (n = _s(e.length, n), !0) : void 0
            });
            for (var i = Fo(n); ++t < n;) i[t] = lt(e, Ut(t));
            return i
        }

        function qi(e, t, n) {
            var i = e ? e.length : 0;
            if (!i) return [];
            var r = Ri(e);
            return null == t ? r : (t = sn(t, n, 4), lt(r, function (e) {
                return ut(e, t, _, !0)
            }))
        }

        function Mi() {
            for (var e = -1, t = arguments.length; ++e < t;) {
                var n = arguments[e];
                if (Kn(n)) var i = i ? ct($t(i, n), $t(n, i)) : n
            }
            return i ? Zt(i) : []
        }

        function Hi(e, t) {
            var n = -1,
                i = e ? e.length : 0,
                r = {};
            for (!i || t || Ea(e[0]) || (t = []); ++n < i;) {
                var o = e[n];
                t ? r[o] = t[n] : o && (r[o[0]] = o[1])
            }
            return r
        }

        function Fi(e) {
            var t = Y(e);
            return t.__chain__ = !0, t
        }

        function zi(e, t, n) {
            return t.call(n, e), e
        }

        function Ui(e, t, n) {
            return t.call(n, e)
        }

        function Wi() {
            return Fi(this)
        }

        function Bi() {
            return new ee(this.value(), this.__chain__)
        }

        function Vi(e) {
            for (var t, n = this; n instanceof Q;) {
                var i = fi(n);
                t ? r.__wrapped__ = i : t = i;
                var r = i;
                n = n.__wrapped__
            }
            return r.__wrapped__ = e, t
        }

        function Ji() {
            var e = this.__wrapped__,
                t = function (e) {
                    return e.reverse()
                };
            if (e instanceof Fe) {
                var n = e;
                return this.__actions__.length && (n = new Fe(this)), n = n.reverse(), n.__actions__.push({
                    func: Ui,
                    args: [t],
                    thisArg: _
                }), new ee(n, this.__chain__)
            }
            return this.thru(t)
        }

        function Yi() {
            return this.value() + ""
        }

        function Xi() {
            return nn(this.__wrapped__, this.__actions__)
        }

        function Gi(e, t, n) {
            var i = Ea(e) ? ot : kt;
            return n && Zn(e, t, n) && (t = _), ("function" != typeof t || n !== _) && (t = Fn(t, n, 3)), i(e, t)
        }

        function Ki(e, t, n) {
            var i = Ea(e) ? at : St;
            return t = Fn(t, n, 3), i(e, t)
        }

        function Qi(e, t) {
            return ra(e, Mt(t))
        }

        function Zi(e, t, n, i) {
            var r = e ? zs(e) : 0;
            return ni(r) || (e = oo(e), r = e.length), n = "number" != typeof n || i && Zn(t, n, i) ? 0 : 0 > n ? _s(r + n, 0) : n || 0, "string" == typeof e || !Ea(e) && zr(e) ? r >= n && e.indexOf(t, n) > -1 : !!r && Un(e, t, n) > -1
        }

        function er(e, t, n) {
            var i = Ea(e) ? lt : qt;
            return t = Fn(t, n, 3), i(e, t)
        }

        function tr(e, t) {
            return er(e, Io(t))
        }

        function nr(e, t, n) {
            var i = Ea(e) ? at : St;
            return t = Fn(t, n, 3), i(e, function (e, n, i) {
                return !t(e, n, i)
            })
        }

        function ir(e, t, n) {
            if (n ? Zn(e, t, n) : null == t) {
                e = ui(e);
                var i = e.length;
                return i > 0 ? e[Vt(0, i - 1)] : _
            }
            var r = -1,
                o = Jr(e),
                i = o.length,
                s = i - 1;
            for (t = $s(0 > t ? 0 : +t || 0, i); ++r < t;) {
                var a = Vt(r, s),
                    l = o[a];
                o[a] = o[r], o[r] = l
            }
            return o.length = t, o
        }

        function rr(e) {
            return ir(e, As)
        }

        function or(e) {
            var t = e ? zs(e) : 0;
            return ni(t) ? t : Ha(e)
                .length
        }

        function sr(e, t, n) {
            var i = Ea(e) ? pt : Xt;
            return n && Zn(e, t, n) && (t = _), ("function" != typeof t || n !== _) && (t = Fn(t, n, 3)), i(e, t)
        }

        function ar(e, t, n) {
            if (null == e) return [];
            n && Zn(e, t, n) && (t = _);
            var i = -1;
            t = Fn(t, n, 3);
            var r = qt(e, function (e, n, r) {
                return {
                    criteria: t(e, n, r),
                    index: ++i,
                    value: e
                }
            });
            return Gt(r, a)
        }

        function lr(e, t, n, i) {
            return null == e ? [] : (i && Zn(t, n, i) && (n = _), Ea(t) || (t = null == t ? [] : [t]), Ea(n) || (n = null == n ? [] : [n]), Kt(e, t, n))
        }

        function cr(e, t) {
            return Ki(e, Mt(t))
        }

        function ur(e, t) {
            if ("function" != typeof t) {
                if ("function" != typeof e) throw new Go(H);
                var n = e;
                e = t, t = n
            }
            return e = ws(e = +e) ? e : 0,
                function () {
                    return --e < 1 ? t.apply(this, arguments) : void 0
                }
        }

        function dr(e, t, n) {
            return n && Zn(e, t, n) && (t = _), t = e && null == t ? e.length : _s(+t || 0, 0), Rn(e, O, _, _, _, _, t)
        }

        function pr(e, t) {
            var n;
            if ("function" != typeof t) {
                if ("function" != typeof e) throw new Go(H);
                var i = e;
                e = t, t = i
            }
            return function () {
                return --e > 0 && (n = t.apply(this, arguments)), 1 >= e && (t = _), n
            }
        }

        function fr(e, t, n) {
            function i() {
                f && as(f), c && as(c), g = 0, c = f = h = _
            }

            function r(t, n) {
                n && as(n), c = f = h = _, t && (g = ga(), u = e.apply(p, l), f || c || (l = p = _))
            }

            function o() {
                var e = t - (ga() - d);
                0 >= e || e > t ? r(h, c) : f = ps(o, e)
            }

            function s() {
                r(m, f)
            }

            function a() {
                if (l = arguments, d = ga(), p = this, h = m && (f || !y), v === !1) var n = y && !f;
                else {
                    c || y || (g = d);
                    var i = v - (d - g),
                        r = 0 >= i || i > v;
                    r ? (c && (c = as(c)), g = d, u = e.apply(p, l)) : c || (c = ps(s, i))
                }
                return r && f ? f = as(f) : f || t === v || (f = ps(o, t)), n && (r = !0, u = e.apply(p, l)), !r || f || c || (l = p = _), u
            }
            var l, c, u, d, p, f, h, g = 0,
                v = !1,
                m = !0;
            if ("function" != typeof e) throw new Go(H);
            if (t = 0 > t ? 0 : +t || 0, n === !0) {
                var y = !0;
                m = !1
            } else Ir(n) && (y = !!n.leading, v = "maxWait" in n && _s(+n.maxWait || 0, t), m = "trailing" in n ? !!n.trailing : m);
            return a.cancel = i, a
        }

        function hr(e, t) {
            if ("function" != typeof e || t && "function" != typeof t) throw new Go(H);
            var n = function () {
                var i = arguments,
                    r = t ? t.apply(this, i) : i[0],
                    o = n.cache;
                if (o.has(r)) return o.get(r);
                var s = e.apply(this, i);
                return n.cache = o.set(r, s),
                    s
            };
            return n.cache = new hr.Cache, n
        }

        function gr(e) {
            if ("function" != typeof e) throw new Go(H);
            return function () {
                return !e.apply(this, arguments)
            }
        }

        function vr(e) {
            return pr(2, e)
        }

        function mr(e, t) {
            if ("function" != typeof e) throw new Go(H);
            return t = _s(t === _ ? e.length - 1 : +t || 0, 0),
                function () {
                    for (var n = arguments, i = -1, r = _s(n.length - t, 0), o = Fo(r); ++i < r;) o[i] = n[t + i];
                    switch (t) {
                    case 0:
                        return e.call(this, o);
                    case 1:
                        return e.call(this, n[0], o);
                    case 2:
                        return e.call(this, n[0], n[1], o)
                    }
                    var s = Fo(t + 1);
                    for (i = -1; ++i < t;) s[i] = n[i];
                    return s[t] = o, e.apply(this, s)
                }
        }

        function yr(e) {
            if ("function" != typeof e) throw new Go(H);
            return function (t) {
                return e.apply(this, t)
            }
        }

        function br(e, t, n) {
            var i = !0,
                r = !0;
            if ("function" != typeof e) throw new Go(H);
            return n === !1 ? i = !1 : Ir(n) && (i = "leading" in n ? !!n.leading : i, r = "trailing" in n ? !!n.trailing : r), fr(e, t, {
                leading: i,
                maxWait: +t,
                trailing: r
            })
        }

        function wr(e, t) {
            return t = null == t ? Ao : t, Rn(t, E, _, [e], [])
        }

        function xr(e, t, n, i) {
            return t && "boolean" != typeof t && Zn(e, t, n) ? t = !1 : "function" == typeof t && (i = n, n = t, t = !1), "function" == typeof n ? xt(e, t, sn(n, i, 3)) : xt(e, t)
        }

        function _r(e, t, n) {
            return "function" == typeof t ? xt(e, !0, sn(t, n, 3)) : xt(e, !0)
        }

        function $r(e, t) {
            return e > t
        }

        function kr(e, t) {
            return e >= t
        }

        function Tr(e) {
            return h(e) && Kn(e) && ts.call(e, "callee") && !us.call(e, "callee")
        }

        function Cr(e) {
            return e === !0 || e === !1 || h(e) && is.call(e) == W
        }

        function Sr(e) {
            return h(e) && is.call(e) == B
        }

        function Ar(e) {
            return !!e && 1 === e.nodeType && h(e) && !Hr(e)
        }

        function Er(e) {
            return null == e ? !0 : Kn(e) && (Ea(e) || zr(e) || Tr(e) || h(e) && Nr(e.splice)) ? !e.length : !Ha(e)
                .length
        }

        function jr(e, t, n, i) {
            n = "function" == typeof n ? sn(n, i, 3) : _;
            var r = n ? n(e, t) : _;
            return r === _ ? Pt(e, t, n) : !!r
        }

        function Or(e) {
            return h(e) && "string" == typeof e.message && is.call(e) == V
        }

        function Dr(e) {
            return "number" == typeof e && ws(e)
        }

        function Nr(e) {
            return Ir(e) && is.call(e) == J
        }

        function Ir(e) {
            var t = typeof e;
            return !!e && ("object" == t || "function" == t)
        }

        function Pr(e, t, n, i) {
            return n = "function" == typeof n ? sn(n, i, 3) : _, Rt(e, Wn(t), n)
        }

        function Lr(e) {
            return Mr(e) && e != +e
        }

        function Rr(e) {
            return null == e ? !1 : Nr(e) ? os.test(es.call(e)) : h(e) && Oe.test(e)
        }

        function qr(e) {
            return null === e
        }

        function Mr(e) {
            return "number" == typeof e || h(e) && is.call(e) == X
        }

        function Hr(e) {
            var t;
            if (!h(e) || is.call(e) != G || Tr(e) || !ts.call(e, "constructor") && (t = e.constructor, "function" == typeof t && !(t instanceof t))) return !1;
            var n;
            return jt(e, function (e, t) {
                n = t
            }), n === _ || ts.call(e, n)
        }

        function Fr(e) {
            return Ir(e) && is.call(e) == K
        }

        function zr(e) {
            return "string" == typeof e || h(e) && is.call(e) == Z
        }

        function Ur(e) {
            return h(e) && ni(e.length) && !!Me[is.call(e)]
        }

        function Wr(e) {
            return e === _
        }

        function Br(e, t) {
            return t > e
        }

        function Vr(e, t) {
            return t >= e
        }

        function Jr(e) {
            var t = e ? zs(e) : 0;
            return ni(t) ? t ? nt(e) : [] : oo(e)
        }

        function Yr(e) {
            return bt(e, eo(e))
        }

        function Xr(e, t, n) {
            var i = Ps(e);
            return n && Zn(e, t, n) && (t = _), t ? mt(i, t) : i
        }

        function Gr(e) {
            return Nt(e, eo(e))
        }

        function Kr(e, t, n) {
            var i = null == e ? _ : It(e, pi(t), t + "");
            return i === _ ? n : i
        }

        function Qr(e, t) {
            if (null == e) return !1;
            var n = ts.call(e, t);
            if (!n && !ei(t)) {
                if (t = pi(t), e = 1 == t.length ? e : It(e, Yt(t, 0, -1)), null == e) return !1;
                t = Ci(t), n = ts.call(e, t)
            }
            return n || ni(e.length) && Qn(t, e.length) && (Ea(e) || Tr(e))
        }

        function Zr(e, t, n) {
            n && Zn(e, t, n) && (t = _);
            for (var i = -1, r = Ha(e), o = r.length, s = {}; ++i < o;) {
                var a = r[i],
                    l = e[a];
                t ? ts.call(s, l) ? s[l].push(a) : s[l] = [a] : s[l] = a
            }
            return s
        }

        function eo(e) {
            if (null == e) return [];
            Ir(e) || (e = Jo(e));
            var t = e.length;
            t = t && ni(t) && (Ea(e) || Tr(e)) && t || 0;
            for (var n = e.constructor, i = -1, r = "function" == typeof n && n.prototype === e, o = Fo(t), s = t > 0; ++i < t;) o[i] = i + "";
            for (var a in e) s && Qn(a, t) || "constructor" == a && (r || !ts.call(e, a)) || o.push(a);
            return o
        }

        function to(e) {
            e = di(e);
            for (var t = -1, n = Ha(e), i = n.length, r = Fo(i); ++t < i;) {
                var o = n[t];
                r[t] = [o, e[o]]
            }
            return r
        }

        function no(e, t, n) {
            var i = null == e ? _ : e[t];
            return i === _ && (null == e || ei(t, e) || (t = pi(t), e = 1 == t.length ? e : It(e, Yt(t, 0, -1)), i = null == e ? _ : e[Ci(t)]), i = i === _ ? n : i), Nr(i) ? i.call(e) : i
        }

        function io(e, t, n) {
            if (null == e) return e;
            var i = t + "";
            t = null != e[i] || ei(t, e) ? [i] : pi(t);
            for (var r = -1, o = t.length, s = o - 1, a = e; null != a && ++r < o;) {
                var l = t[r];
                Ir(a) && (r == s ? a[l] = n : null == a[l] && (a[l] = Qn(t[r + 1]) ? [] : {})), a = a[l]
            }
            return e
        }

        function ro(e, t, n, i) {
            var r = Ea(e) || Ur(e);
            if (t = Fn(t, i, 4), null == n)
                if (r || Ir(e)) {
                    var o = e.constructor;
                    n = r ? Ea(e) ? new o : [] : Ps(Nr(o) ? o.prototype : _)
                } else n = {};
            return (r ? it : Ot)(e, function (e, i, r) {
                return t(n, e, i, r)
            }), n
        }

        function oo(e) {
            return en(e, Ha(e))
        }

        function so(e) {
            return en(e, eo(e))
        }

        function ao(e, t, n) {
            return t = +t || 0, n === _ ? (n = t, t = 0) : n = +n || 0, e >= $s(t, n) && e < _s(t, n)
        }

        function lo(e, t, n) {
            n && Zn(e, t, n) && (t = n = _);
            var i = null == e,
                r = null == t;
            if (null == n && (r && "boolean" == typeof e ? (n = e, e = 1) : "boolean" == typeof t && (n = t, r = !0)), i && r && (t = 1, r = !1), e = +e || 0, r ? (t = e, e = 0) : t = +t || 0, n || e % 1 || t % 1) {
                var o = Cs();
                return $s(e + o * (t - e + ls("1e-" + ((o + "")
                    .length - 1))), t)
            }
            return Vt(e, t)
        }

        function co(e) {
            return e = r(e), e && e.charAt(0)
                .toUpperCase() + e.slice(1)
        }

        function uo(e) {
            return e = r(e), e && e.replace(Ne, c)
                .replace(Ce, "")
        }

        function po(e, t, n) {
            e = r(e), t += "";
            var i = e.length;
            return n = n === _ ? i : $s(0 > n ? 0 : +n || 0, i), n -= t.length, n >= 0 && e.indexOf(t, n) == n
        }

        function fo(e) {
            return e = r(e), e && me.test(e) ? e.replace(ge, u) : e
        }

        function ho(e) {
            return e = r(e), e && Te.test(e) ? e.replace(ke, d) : e || "(?:)"
        }

        function go(e, t, n) {
            e = r(e), t = +t;
            var i = e.length;
            if (i >= t || !ws(t)) return e;
            var o = (t - i) / 2,
                s = ys(o),
                a = vs(o);
            return n = Nn("", a, n), n.slice(0, s) + e + n
        }

        function vo(e, t, n) {
            return (n ? Zn(e, t, n) : null == t) ? t = 0 : t && (t = +t), e = wo(e), Ts(e, t || (je.test(e) ? 16 : 10))
        }

        function mo(e, t) {
            var n = "";
            if (e = r(e), t = +t, 1 > t || !e || !ws(t)) return n;
            do t % 2 && (n += e), t = ys(t / 2), e += e; while (t);
            return n
        }

        function yo(e, t, n) {
            return e = r(e), n = null == n ? 0 : $s(0 > n ? 0 : +n || 0, e.length), e.lastIndexOf(t, n) == n
        }

        function bo(e, t, n) {
            var i = Y.templateSettings;
            n && Zn(e, t, n) && (t = n = _), e = r(e), t = vt(mt({}, n || t), i, gt);
            var o, s, a = vt(mt({}, t.imports), i.imports, gt),
                l = Ha(a),
                c = en(a, l),
                u = 0,
                d = t.interpolate || Ie,
                f = "__p += '",
                h = Yo((t.escape || Ie)
                    .source + "|" + d.source + "|" + (d === we ? Ae : Ie)
                    .source + "|" + (t.evaluate || Ie)
                    .source + "|$", "g"),
                g = "//# sourceURL=" + ("sourceURL" in t ? t.sourceURL : "lodash.templateSources[" + ++qe + "]") + "\n";
            e.replace(h, function (t, n, i, r, a, l) {
                return i || (i = r), f += e.slice(u, l)
                    .replace(Pe, p), n && (o = !0, f += "' +\n__e(" + n + ") +\n'"), a && (s = !0, f += "';\n" + a + ";\n__p += '"), i && (f += "' +\n((__t = (" + i + ")) == null ? '' : __t) +\n'"), u = l + t.length, t
            }), f += "';\n";
            var v = t.variable;
            v || (f = "with (obj) {\n" + f + "\n}\n"), f = (s ? f.replace(de, "") : f)
                .replace(pe, "$1")
                .replace(fe, "$1;"), f = "function(" + (v || "obj") + ") {\n" + (v ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (o ? ", __e = _.escape" : "") + (s ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + f + "return __p\n}";
            var m = Ka(function () {
                return Wo(l, g + "return " + f)
                    .apply(_, c)
            });
            if (m.source = f, Or(m)) throw m;
            return m
        }

        function wo(e, t, n) {
            var i = e;
            return (e = r(e)) ? (n ? Zn(i, t, n) : null == t) ? e.slice(y(e), b(e) + 1) : (t += "", e.slice(o(e, t), s(e, t) + 1)) : e
        }

        function xo(e, t, n) {
            var i = e;
            return e = r(e), e ? (n ? Zn(i, t, n) : null == t) ? e.slice(y(e)) : e.slice(o(e, t + "")) : e
        }

        function _o(e, t, n) {
            var i = e;
            return e = r(e), e ? (n ? Zn(i, t, n) : null == t) ? e.slice(0, b(e) + 1) : e.slice(0, s(e, t + "") + 1) : e
        }

        function $o(e, t, n) {
            n && Zn(e, t, n) && (t = _);
            var i = N,
                o = I;
            if (null != t)
                if (Ir(t)) {
                    var s = "separator" in t ? t.separator : s;
                    i = "length" in t ? +t.length || 0 : i, o = "omission" in t ? r(t.omission) : o
                } else i = +t || 0;
            if (e = r(e), i >= e.length) return e;
            var a = i - o.length;
            if (1 > a) return o;
            var l = e.slice(0, a);
            if (null == s) return l + o;
            if (Fr(s)) {
                if (e.slice(a)
                    .search(s)) {
                    var c, u, d = e.slice(0, a);
                    for (s.global || (s = Yo(s.source, (Ee.exec(s) || "") + "g")), s.lastIndex = 0; c = s.exec(d);) u = c.index;
                    l = l.slice(0, null == u ? a : u)
                }
            } else if (e.indexOf(s, a) != a) {
                var p = l.lastIndexOf(s);
                p > -1 && (l = l.slice(0, p))
            }
            return l + o
        }

        function ko(e) {
            return e = r(e), e && ve.test(e) ? e.replace(he, w) : e
        }

        function To(e, t, n) {
            return n && Zn(e, t, n) && (t = _), e = r(e), e.match(t || Le) || []
        }

        function Co(e, t, n) {
            return n && Zn(e, t, n) && (t = _), h(e) ? Eo(e) : wt(e, t)
        }

        function So(e) {
            return function () {
                return e
            }
        }

        function Ao(e) {
            return e
        }

        function Eo(e) {
            return Mt(xt(e, !0))
        }

        function jo(e, t) {
            return Ht(e, xt(t, !0))
        }

        function Oo(e, t, n) {
            if (null == n) {
                var i = Ir(t),
                    r = i ? Ha(t) : _,
                    o = r && r.length ? Nt(t, r) : _;
                (o ? o.length : i) || (o = !1, n = t, t = e, e = this)
            }
            o || (o = Nt(t, Ha(t)));
            var s = !0,
                a = -1,
                l = Nr(e),
                c = o.length;
            n === !1 ? s = !1 : Ir(n) && "chain" in n && (s = n.chain);
            for (; ++a < c;) {
                var u = o[a],
                    d = t[u];
                e[u] = d, l && (e.prototype[u] = function (t) {
                    return function () {
                        var n = this.__chain__;
                        if (s || n) {
                            var i = e(this.__wrapped__),
                                r = i.__actions__ = nt(this.__actions__);
                            return r.push({
                                func: t,
                                args: arguments,
                                thisArg: e
                            }), i.__chain__ = n, i
                        }
                        return t.apply(e, ct([this.value()], arguments))
                    }
                }(d))
            }
            return e
        }

        function Do() {
            return Ze._ = rs, this
        }

        function No() {}

        function Io(e) {
            return ei(e) ? Ut(e) : Wt(e)
        }

        function Po(e) {
            return function (t) {
                return It(e, pi(t), t + "")
            }
        }

        function Lo(e, t, n) {
            n && Zn(e, t, n) && (t = n = _), e = +e || 0, n = null == n ? 1 : +n || 0, null == t ? (t = e, e = 0) : t = +t || 0;
            for (var i = -1, r = _s(vs((t - e) / (n || 1)), 0), o = Fo(r); ++i < r;) o[i] = e, e += n;
            return o
        }

        function Ro(e, t, n) {
            if (e = ys(e), 1 > e || !ws(e)) return [];
            var i = -1,
                r = Fo($s(e, Es));
            for (t = sn(t, n, 1); ++i < e;) Es > i ? r[i] = t(i) : t(i);
            return r
        }

        function qo(e) {
            var t = ++ns;
            return r(e) + t
        }

        function Mo(e, t) {
            return (+e || 0) + (+t || 0)
        }

        function Ho(e, t, n) {
            return n && Zn(e, t, n) && (t = _), t = Fn(t, n, 3), 1 == t.length ? ft(Ea(e) ? e : ui(e), t) : Qt(e, t)
        }
        g = g ? et.defaults(Ze.Object(), g, et.pick(Ze, Re)) : Ze;
        var Fo = g.Array,
            zo = g.Date,
            Uo = g.Error,
            Wo = g.Function,
            Bo = g.Math,
            Vo = g.Number,
            Jo = g.Object,
            Yo = g.RegExp,
            Xo = g.String,
            Go = g.TypeError,
            Ko = Fo.prototype,
            Qo = Jo.prototype,
            Zo = Xo.prototype,
            es = Wo.prototype.toString,
            ts = Qo.hasOwnProperty,
            ns = 0,
            is = Qo.toString,
            rs = Ze._,
            os = Yo("^" + es.call(ts)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
            ss = g.ArrayBuffer,
            as = g.clearTimeout,
            ls = g.parseFloat,
            cs = Bo.pow,
            us = Qo.propertyIsEnumerable,
            ds = Bn(g, "Set"),
            ps = g.setTimeout,
            fs = Ko.splice,
            hs = g.Uint8Array,
            gs = Bn(g, "WeakMap"),
            vs = Bo.ceil,
            ms = Bn(Jo, "create"),
            ys = Bo.floor,
            bs = Bn(Fo, "isArray"),
            ws = g.isFinite,
            xs = Bn(Jo, "keys"),
            _s = Bo.max,
            $s = Bo.min,
            ks = Bn(zo, "now"),
            Ts = g.parseInt,
            Cs = Bo.random,
            Ss = Vo.NEGATIVE_INFINITY,
            As = Vo.POSITIVE_INFINITY,
            Es = 4294967295,
            js = Es - 1,
            Os = Es >>> 1,
            Ds = 9007199254740991,
            Ns = gs && new gs,
            Is = {};
        Y.support = {};
        Y.templateSettings = {
            escape: ye,
            evaluate: be,
            interpolate: we,
            variable: "",
            imports: {
                _: Y
            }
        };
        var Ps = function () {
                function e() {}
                return function (t) {
                    if (Ir(t)) {
                        e.prototype = t;
                        var n = new e;
                        e.prototype = _
                    }
                    return n || {}
                }
            }(),
            Ls = pn(Ot),
            Rs = pn(Dt, !0),
            qs = fn(),
            Ms = fn(!0),
            Hs = Ns ? function (e, t) {
                return Ns.set(e, t), e
            } : Ao,
            Fs = Ns ? function (e) {
                return Ns.get(e)
            } : No,
            zs = Ut("length"),
            Us = function () {
                var e = 0,
                    t = 0;
                return function (n, i) {
                    var r = ga(),
                        o = L - (r - t);
                    if (t = r, o > 0) {
                        if (++e >= P) return n
                    } else e = 0;
                    return Hs(n, i)
                }
            }(),
            Ws = mr(function (e, t) {
                return h(e) && Kn(e) ? $t(e, Et(t, !1, !0)) : []
            }),
            Bs = _n(),
            Vs = _n(!0),
            Js = mr(function (e) {
                for (var t = e.length, i = t, r = Fo(d), o = Un(), s = o === n, a = []; i--;) {
                    var l = e[i] = Kn(l = e[i]) ? l : [];
                    r[i] = s && l.length >= 120 ? gn(i && l) : null
                }
                var c = e[0],
                    u = -1,
                    d = c ? c.length : 0,
                    p = r[0];
                e: for (; ++u < d;)
                    if (l = c[u], (p ? Ke(p, l) : o(a, l, 0)) < 0) {
                        for (var i = t; --i;) {
                            var f = r[i];
                            if ((f ? Ke(f, l) : o(e[i], l, 0)) < 0) continue e
                        }
                        p && p.push(l), a.push(l)
                    }
                return a
            }),
            Ys = mr(function (t, n) {
                n = Et(n);
                var i = yt(t, n);
                return Bt(t, n.sort(e)), i
            }),
            Xs = Ln(),
            Gs = Ln(!0),
            Ks = mr(function (e) {
                return Zt(Et(e, !1, !0))
            }),
            Qs = mr(function (e, t) {
                return Kn(e) ? $t(e, t) : []
            }),
            Zs = mr(Ri),
            ea = mr(function (e) {
                var t = e.length,
                    n = t > 2 ? e[t - 2] : _,
                    i = t > 1 ? e[t - 1] : _;
                return t > 2 && "function" == typeof n ? t -= 2 : (n = t > 1 && "function" == typeof i ? (--t, i) : _, i = _), e.length = t, qi(e, n, i)
            }),
            ta = mr(function (e) {
                return e = Et(e), this.thru(function (t) {
                    return tt(Ea(t) ? t : [di(t)], e)
                })
            }),
            na = mr(function (e, t) {
                return yt(e, Et(t))
            }),
            ia = un(function (e, t, n) {
                ts.call(e, n) ? ++e[n] : e[n] = 1
            }),
            ra = xn(Ls),
            oa = xn(Rs, !0),
            sa = Tn(it, Ls),
            aa = Tn(rt, Rs),
            la = un(function (e, t, n) {
                ts.call(e, n) ? e[n].push(t) : e[n] = [t]
            }),
            ca = un(function (e, t, n) {
                e[n] = t
            }),
            ua = mr(function (e, t, n) {
                var i = -1,
                    r = "function" == typeof t,
                    o = ei(t),
                    s = Kn(e) ? Fo(e.length) : [];
                return Ls(e, function (e) {
                    var a = r ? t : o && null != e ? e[t] : _;
                    s[++i] = a ? a.apply(e, n) : Gn(e, t, n)
                }), s
            }),
            da = un(function (e, t, n) {
                e[n ? 0 : 1].push(t)
            }, function () {
                return [
                    [],
                    []
                ]
            }),
            pa = On(ut, Ls),
            fa = On(dt, Rs),
            ha = mr(function (e, t) {
                if (null == e) return [];
                var n = t[2];
                return n && Zn(t[0], t[1], n) && (t.length = 1), Kt(e, Et(t), [])
            }),
            ga = ks || function () {
                return (new zo)
                    .getTime()
            },
            va = mr(function (e, t, n) {
                var i = k;
                if (n.length) {
                    var r = v(n, va.placeholder);
                    i |= E
                }
                return Rn(e, i, t, n, r)
            }),
            ma = mr(function (e, t) {
                t = t.length ? Et(t) : Gr(e);
                for (var n = -1, i = t.length; ++n < i;) {
                    var r = t[n];
                    e[r] = Rn(e[r], k, e)
                }
                return e
            }),
            ya = mr(function (e, t, n) {
                var i = k | T;
                if (n.length) {
                    var r = v(n, ya.placeholder);
                    i |= E
                }
                return Rn(t, i, e, n, r)
            }),
            ba = yn(S),
            wa = yn(A),
            xa = mr(function (e, t) {
                return _t(e, 1, t)
            }),
            _a = mr(function (e, t, n) {
                return _t(e, t, n)
            }),
            $a = kn(),
            ka = kn(!0),
            Ta = mr(function (e, t) {
                if (t = Et(t), "function" != typeof e || !ot(t, i)) throw new Go(H);
                var n = t.length;
                return mr(function (i) {
                    for (var r = $s(i.length, n); r--;) i[r] = t[r](i[r]);
                    return e.apply(this, i)
                })
            }),
            Ca = jn(E),
            Sa = jn(j),
            Aa = mr(function (e, t) {
                return Rn(e, D, _, _, _, Et(t))
            }),
            Ea = bs || function (e) {
                return h(e) && ni(e.length) && is.call(e) == U
            },
            ja = dn(Ft),
            Oa = dn(function (e, t, n) {
                return n ? vt(e, t, n) : mt(e, t)
            }),
            Da = bn(Oa, ht),
            Na = bn(ja, oi),
            Ia = $n(Ot),
            Pa = $n(Dt),
            La = Cn(qs),
            Ra = Cn(Ms),
            qa = Sn(Ot),
            Ma = Sn(Dt),
            Ha = xs ? function (e) {
                var t = null == e ? _ : e.constructor;
                return "function" == typeof t && t.prototype === e || "function" != typeof e && Kn(e) ? ci(e) : Ir(e) ? xs(e) : []
            } : ci,
            Fa = An(!0),
            za = An(),
            Ua = mr(function (e, t) {
                if (null == e) return {};
                if ("function" != typeof t[0]) {
                    var t = lt(Et(t), Xo);
                    return si(e, $t(eo(e), t))
                }
                var n = sn(t[0], t[1], 3);
                return ai(e, function (e, t, i) {
                    return !n(e, t, i)
                })
            }),
            Wa = mr(function (e, t) {
                return null == e ? {} : "function" == typeof t[0] ? ai(e, sn(t[0], t[1], 3)) : si(e, Et(t))
            }),
            Ba = vn(function (e, t, n) {
                return t = t.toLowerCase(), e + (n ? t.charAt(0)
                    .toUpperCase() + t.slice(1) : t)
            }),
            Va = vn(function (e, t, n) {
                return e + (n ? "-" : "") + t.toLowerCase()
            }),
            Ja = En(),
            Ya = En(!0),
            Xa = vn(function (e, t, n) {
                return e + (n ? "_" : "") + t.toLowerCase()
            }),
            Ga = vn(function (e, t, n) {
                return e + (n ? " " : "") + (t.charAt(0)
                    .toUpperCase() + t.slice(1))
            }),
            Ka = mr(function (e, t) {
                try {
                    return e.apply(_, t)
                } catch (n) {
                    return Or(n) ? n : new Uo(n)
                }
            }),
            Qa = mr(function (e, t) {
                return function (n) {
                    return Gn(n, e, t)
                }
            }),
            Za = mr(function (e, t) {
                return function (n) {
                    return Gn(e, n, t)
                }
            }),
            el = Pn("ceil"),
            tl = Pn("floor"),
            nl = wn($r, Ss),
            il = wn(Br, As),
            rl = Pn("round");
        return Y.prototype = Q.prototype, ee.prototype = Ps(Q.prototype), ee.prototype.constructor = ee, Fe.prototype = Ps(Q.prototype), Fe.prototype.constructor = Fe, Be.prototype["delete"] = Ve, Be.prototype.get = Je, Be.prototype.has = Ye, Be.prototype.set = Xe, Ge.prototype.push = Qe, hr.Cache = Be, Y.after = ur, Y.ary = dr, Y.assign = Oa, Y.at = na, Y.before = pr, Y.bind = va, Y.bindAll = ma, Y.bindKey = ya, Y.callback = Co, Y.chain = Fi, Y.chunk = hi, Y.compact = gi, Y.constant = So, Y.countBy = ia, Y.create = Xr, Y.curry = ba, Y.curryRight = wa, Y.debounce = fr, Y.defaults = Da, Y.defaultsDeep = Na, Y.defer = xa, Y.delay = _a, Y.difference = Ws, Y.drop = vi, Y.dropRight = mi, Y.dropRightWhile = yi, Y.dropWhile = bi, Y.fill = wi, Y.filter = Ki, Y.flatten = _i, Y.flattenDeep = $i, Y.flow = $a, Y.flowRight = ka, Y.forEach = sa, Y.forEachRight = aa, Y.forIn = La, Y.forInRight = Ra, Y.forOwn = qa, Y.forOwnRight = Ma, Y.functions = Gr, Y.groupBy = la, Y.indexBy = ca, Y.initial = Ti, Y.intersection = Js, Y.invert = Zr, Y.invoke = ua, Y.keys = Ha, Y.keysIn = eo, Y.map = er, Y.mapKeys = Fa, Y.mapValues = za, Y.matches = Eo, Y.matchesProperty = jo, Y.memoize = hr, Y.merge = ja, Y.method = Qa, Y.methodOf = Za, Y.mixin = Oo, Y.modArgs = Ta, Y.negate = gr, Y.omit = Ua, Y.once = vr, Y.pairs = to, Y.partial = Ca, Y.partialRight = Sa, Y.partition = da, Y.pick = Wa, Y.pluck = tr, Y.property = Io, Y.propertyOf = Po, Y.pull = Ai, Y.pullAt = Ys, Y.range = Lo, Y.rearg = Aa, Y.reject = nr, Y.remove = Ei, Y.rest = ji, Y.restParam = mr, Y.set = io, Y.shuffle = rr, Y.slice = Oi, Y.sortBy = ar, Y.sortByAll = ha, Y.sortByOrder = lr, Y.spread = yr, Y.take = Di, Y.takeRight = Ni, Y.takeRightWhile = Ii, Y.takeWhile = Pi, Y.tap = zi, Y.throttle = br, Y.thru = Ui, Y.times = Ro, Y.toArray = Jr, Y.toPlainObject = Yr, Y.transform = ro, Y.union = Ks, Y.uniq = Li, Y.unzip = Ri, Y.unzipWith = qi, Y.values = oo, Y.valuesIn = so, Y.where = cr, Y.without = Qs, Y.wrap = wr, Y.xor = Mi, Y.zip = Zs, Y.zipObject = Hi, Y.zipWith = ea, Y.backflow = ka, Y.collect = er, Y.compose = ka, Y.each = sa, Y.eachRight = aa, Y.extend = Oa, Y.iteratee = Co, Y.methods = Gr, Y.object = Hi, Y.select = Ki, Y.tail = ji, Y.unique = Li, Oo(Y, Y), Y.add = Mo, Y.attempt = Ka, Y.camelCase = Ba, Y.capitalize = co, Y.ceil = el, Y.clone = xr, Y.cloneDeep = _r, Y.deburr = uo, Y.endsWith = po, Y.escape = fo, Y.escapeRegExp = ho, Y.every = Gi, Y.find = ra, Y.findIndex = Bs, Y.findKey = Ia, Y.findLast = oa, Y.findLastIndex = Vs, Y.findLastKey = Pa, Y.findWhere = Qi, Y.first = xi, Y.floor = tl, Y.get = Kr, Y.gt = $r, Y.gte = kr, Y.has = Qr, Y.identity = Ao, Y.includes = Zi, Y.indexOf = ki, Y.inRange = ao, Y.isArguments = Tr, Y.isArray = Ea, Y.isBoolean = Cr, Y.isDate = Sr, Y.isElement = Ar, Y.isEmpty = Er, Y.isEqual = jr, Y.isError = Or, Y.isFinite = Dr, Y.isFunction = Nr, Y.isMatch = Pr, Y.isNaN = Lr, Y.isNative = Rr, Y.isNull = qr, Y.isNumber = Mr, Y.isObject = Ir, Y.isPlainObject = Hr, Y.isRegExp = Fr, Y.isString = zr, Y.isTypedArray = Ur, Y.isUndefined = Wr, Y.kebabCase = Va, Y.last = Ci, Y.lastIndexOf = Si, Y.lt = Br, Y.lte = Vr, Y.max = nl, Y.min = il, Y.noConflict = Do, Y.noop = No, Y.now = ga, Y.pad = go, Y.padLeft = Ja, Y.padRight = Ya, Y.parseInt = vo, Y.random = lo, Y.reduce = pa, Y.reduceRight = fa, Y.repeat = mo, Y.result = no, Y.round = rl, Y.runInContext = x, Y.size = or, Y.snakeCase = Xa, Y.some = sr, Y.sortedIndex = Xs, Y.sortedLastIndex = Gs, Y.startCase = Ga, Y.startsWith = yo, Y.sum = Ho, Y.template = bo, Y.trim = wo, Y.trimLeft = xo, Y.trimRight = _o, Y.trunc = $o, Y.unescape = ko, Y.uniqueId = qo, Y.words = To, Y.all = Gi, Y.any = sr, Y.contains = Zi, Y.eq = jr, Y.detect = ra, Y.foldl = pa, Y.foldr = fa, Y.head = xi, Y.include = Zi, Y.inject = pa, Oo(Y, function () {
            var e = {};
            return Ot(Y, function (t, n) {
                Y.prototype[n] || (e[n] = t)
            }), e
        }(), !1), Y.sample = ir, Y.prototype.sample = function (e) {
            return this.__chain__ || null != e ? this.thru(function (t) {
                return ir(t, e)
            }) : ir(this.value())
        }, Y.VERSION = $, it(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (e) {
            Y[e].placeholder = Y
        }), it(["drop", "take"], function (e, t) {
            Fe.prototype[e] = function (n) {
                var i = this.__filtered__;
                if (i && !t) return new Fe(this);
                n = null == n ? 1 : _s(ys(n) || 0, 0);
                var r = this.clone();
                return i ? r.__takeCount__ = $s(r.__takeCount__, n) : r.__views__.push({
                    size: n,
                    type: e + (r.__dir__ < 0 ? "Right" : "")
                }), r
            }, Fe.prototype[e + "Right"] = function (t) {
                return this.reverse()[e](t)
                    .reverse()
            }
        }), it(["filter", "map", "takeWhile"], function (e, t) {
            var n = t + 1,
                i = n != M;
            Fe.prototype[e] = function (e, t) {
                var r = this.clone();
                return r.__iteratees__.push({
                    iteratee: Fn(e, t, 1),
                    type: n
                }), r.__filtered__ = r.__filtered__ || i, r
            }
        }), it(["first", "last"], function (e, t) {
            var n = "take" + (t ? "Right" : "");
            Fe.prototype[e] = function () {
                return this[n](1)
                    .value()[0]
            }
        }), it(["initial", "rest"], function (e, t) {
            var n = "drop" + (t ? "" : "Right");
            Fe.prototype[e] = function () {
                return this.__filtered__ ? new Fe(this) : this[n](1)
            }
        }), it(["pluck", "where"], function (e, t) {
            var n = t ? "filter" : "map",
                i = t ? Mt : Io;
            Fe.prototype[e] = function (e) {
                return this[n](i(e))
            }
        }), Fe.prototype.compact = function () {
            return this.filter(Ao)
        }, Fe.prototype.reject = function (e, t) {
            return e = Fn(e, t, 1), this.filter(function (t) {
                return !e(t)
            })
        }, Fe.prototype.slice = function (e, t) {
            e = null == e ? 0 : +e || 0;
            var n = this;
            return n.__filtered__ && (e > 0 || 0 > t) ? new Fe(n) : (0 > e ? n = n.takeRight(-e) : e && (n = n.drop(e)), t !== _ && (t = +t || 0, n = 0 > t ? n.dropRight(-t) : n.take(t - e)), n)
        }, Fe.prototype.takeRightWhile = function (e, t) {
            return this.reverse()
                .takeWhile(e, t)
                .reverse()
        }, Fe.prototype.toArray = function () {
            return this.take(As)
        }, Ot(Fe.prototype, function (e, t) {
            var n = /^(?:filter|map|reject)|While$/.test(t),
                i = /^(?:first|last)$/.test(t),
                r = Y[i ? "take" + ("last" == t ? "Right" : "") : t];
            r && (Y.prototype[t] = function () {
                var t = i ? [1] : arguments,
                    o = this.__chain__,
                    s = this.__wrapped__,
                    a = !!this.__actions__.length,
                    l = s instanceof Fe,
                    c = t[0],
                    u = l || Ea(s);
                u && n && "function" == typeof c && 1 != c.length && (l = u = !1);
                var d = function (e) {
                        return i && o ? r(e, 1)[0] : r.apply(_, ct([e], t))
                    },
                    p = {
                        func: Ui,
                        args: [d],
                        thisArg: _
                    },
                    f = l && !a;
                if (i && !o) return f ? (s = s.clone(), s.__actions__.push(p), e.call(s)) : r.call(_, this.value())[0];
                if (!i && u) {
                    s = f ? s : new Fe(this);
                    var h = e.apply(s, t);
                    return h.__actions__.push(p), new ee(h, o)
                }
                return this.thru(d)
            })
        }), it(["join", "pop", "push", "replace", "shift", "sort", "splice", "split", "unshift"], function (e) {
            var t = (/^(?:replace|split)$/.test(e) ? Zo : Ko)[e],
                n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru",
                i = /^(?:join|pop|replace|shift)$/.test(e);
            Y.prototype[e] = function () {
                var e = arguments;
                return i && !this.__chain__ ? t.apply(this.value(), e) : this[n](function (n) {
                    return t.apply(n, e)
                })
            }
        }), Ot(Fe.prototype, function (e, t) {
            var n = Y[t];
            if (n) {
                var i = n.name + "",
                    r = Is[i] || (Is[i] = []);
                r.push({
                    name: t,
                    func: n
                })
            }
        }), Is[Dn(_, T)
            .name] = [{
            name: "wrapper",
            func: _
        }], Fe.prototype.clone = ze, Fe.prototype.reverse = Ue, Fe.prototype.value = We, Y.prototype.chain = Wi, Y.prototype.commit = Bi, Y.prototype.concat = ta, Y.prototype.plant = Vi, Y.prototype.reverse = Ji, Y.prototype.toString = Yi, Y.prototype.run = Y.prototype.toJSON = Y.prototype.valueOf = Y.prototype.value = Xi, Y.prototype.collect = Y.prototype.map, Y.prototype.head = Y.prototype.first, Y.prototype.select = Y.prototype.filter, Y.prototype.tail = Y.prototype.rest, Y
    }
    var _, $ = "3.10.1",
        k = 1,
        T = 2,
        C = 4,
        S = 8,
        A = 16,
        E = 32,
        j = 64,
        O = 128,
        D = 256,
        N = 30,
        I = "...",
        P = 150,
        L = 16,
        R = 200,
        q = 1,
        M = 2,
        H = "Expected a function",
        F = "__lodash_placeholder__",
        z = "[object Arguments]",
        U = "[object Array]",
        W = "[object Boolean]",
        B = "[object Date]",
        V = "[object Error]",
        J = "[object Function]",
        Y = "[object Map]",
        X = "[object Number]",
        G = "[object Object]",
        K = "[object RegExp]",
        Q = "[object Set]",
        Z = "[object String]",
        ee = "[object WeakMap]",
        te = "[object ArrayBuffer]",
        ne = "[object Float32Array]",
        ie = "[object Float64Array]",
        re = "[object Int8Array]",
        oe = "[object Int16Array]",
        se = "[object Int32Array]",
        ae = "[object Uint8Array]",
        le = "[object Uint8ClampedArray]",
        ce = "[object Uint16Array]",
        ue = "[object Uint32Array]",
        de = /\b__p \+= '';/g,
        pe = /\b(__p \+=) '' \+/g,
        fe = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
        he = /&(?:amp|lt|gt|quot|#39|#96);/g,
        ge = /[&<>"'`]/g,
        ve = RegExp(he.source),
        me = RegExp(ge.source),
        ye = /<%-([\s\S]+?)%>/g,
        be = /<%([\s\S]+?)%>/g,
        we = /<%=([\s\S]+?)%>/g,
        xe = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
        _e = /^\w*$/,
        $e = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
        ke = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
        Te = RegExp(ke.source),
        Ce = /[\u0300-\u036f\ufe20-\ufe23]/g,
        Se = /\\(\\)?/g,
        Ae = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
        Ee = /\w*$/,
        je = /^0[xX]/,
        Oe = /^\[object .+?Constructor\]$/,
        De = /^\d+$/,
        Ne = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,
        Ie = /($^)/,
        Pe = /['\n\r\u2028\u2029\\]/g,
        Le = function () {
            var e = "[A-Z\\xc0-\\xd6\\xd8-\\xde]",
                t = "[a-z\\xdf-\\xf6\\xf8-\\xff]+";
            return RegExp(e + "+(?=" + e + t + ")|" + e + "?" + t + "|" + e + "+|[0-9]+", "g")
        }(),
        Re = ["Array", "ArrayBuffer", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Math", "Number", "Object", "RegExp", "Set", "String", "_", "clearTimeout", "isFinite", "parseFloat", "parseInt", "setTimeout", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap"],
        qe = -1,
        Me = {};
    Me[ne] = Me[ie] = Me[re] = Me[oe] = Me[se] = Me[ae] = Me[le] = Me[ce] = Me[ue] = !0, Me[z] = Me[U] = Me[te] = Me[W] = Me[B] = Me[V] = Me[J] = Me[Y] = Me[X] = Me[G] = Me[K] = Me[Q] = Me[Z] = Me[ee] = !1;
    var He = {};
    He[z] = He[U] = He[te] = He[W] = He[B] = He[ne] = He[ie] = He[re] = He[oe] = He[se] = He[X] = He[G] = He[K] = He[Z] = He[ae] = He[le] = He[ce] = He[ue] = !0, He[V] = He[J] = He[Y] = He[Q] = He[ee] = !1;
    var Fe = {
            "\xc0": "A",
            "\xc1": "A",
            "\xc2": "A",
            "\xc3": "A",
            "\xc4": "A",
            "\xc5": "A",
            "\xe0": "a",
            "\xe1": "a",
            "\xe2": "a",
            "\xe3": "a",
            "\xe4": "a",
            "\xe5": "a",
            "\xc7": "C",
            "\xe7": "c",
            "\xd0": "D",
            "\xf0": "d",
            "\xc8": "E",
            "\xc9": "E",
            "\xca": "E",
            "\xcb": "E",
            "\xe8": "e",
            "\xe9": "e",
            "\xea": "e",
            "\xeb": "e",
            "\xcc": "I",
            "\xcd": "I",
            "\xce": "I",
            "\xcf": "I",
            "\xec": "i",
            "\xed": "i",
            "\xee": "i",
            "\xef": "i",
            "\xd1": "N",
            "\xf1": "n",
            "\xd2": "O",
            "\xd3": "O",
            "\xd4": "O",
            "\xd5": "O",
            "\xd6": "O",
            "\xd8": "O",
            "\xf2": "o",
            "\xf3": "o",
            "\xf4": "o",
            "\xf5": "o",
            "\xf6": "o",
            "\xf8": "o",
            "\xd9": "U",
            "\xda": "U",
            "\xdb": "U",
            "\xdc": "U",
            "\xf9": "u",
            "\xfa": "u",
            "\xfb": "u",
            "\xfc": "u",
            "\xdd": "Y",
            "\xfd": "y",
            "\xff": "y",
            "\xc6": "Ae",
            "\xe6": "ae",
            "\xde": "Th",
            "\xfe": "th",
            "\xdf": "ss"
        },
        ze = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "`": "&#96;"
        },
        Ue = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"',
            "&#39;": "'",
            "&#96;": "`"
        },
        We = {
            "function": !0,
            object: !0
        },
        Be = {
            0: "x30",
            1: "x31",
            2: "x32",
            3: "x33",
            4: "x34",
            5: "x35",
            6: "x36",
            7: "x37",
            8: "x38",
            9: "x39",
            A: "x41",
            B: "x42",
            C: "x43",
            D: "x44",
            E: "x45",
            F: "x46",
            a: "x61",
            b: "x62",
            c: "x63",
            d: "x64",
            e: "x65",
            f: "x66",
            n: "x6e",
            r: "x72",
            t: "x74",
            u: "x75",
            v: "x76",
            x: "x78"
        },
        Ve = {
            "\\": "\\",
            "'": "'",
            "\n": "n",
            "\r": "r",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        Je = We[typeof exports] && exports && !exports.nodeType && exports,
        Ye = We[typeof module] && module && !module.nodeType && module,
        Xe = Je && Ye && "object" == typeof global && global && global.Object && global,
        Ge = We[typeof self] && self && self.Object && self,
        Ke = We[typeof window] && window && window.Object && window,
        Qe = Ye && Ye.exports === Je && Je,
        Ze = Xe || Ke !== (this && this.window) && Ke || Ge || this,
        et = x();
    "function" == typeof define && "object" == typeof define.amd && define.amd ? (Ze._ = et, define(function () {
            return et
        })) : Je && Ye ? Qe ? (Ye.exports = et)
        ._ = et : Je._ = et : Ze._ = et
}.call(this),
    function (e) {
        "use strict";
        "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
    }(function (e) {
        "use strict";
        var t = window.Slick || {};
        t = function () {
            function t(t, i) {
                var r, o = this;
                o.defaults = {
                        accessibility: !0,
                        adaptiveHeight: !1,
                        appendArrows: e(t),
                        appendDots: e(t),
                        arrows: !0,
                        asNavFor: null,
                        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                        autoplay: !1,
                        autoplaySpeed: 3e3,
                        centerMode: !1,
                        centerPadding: "50px",
                        cssEase: "ease",
                        customPaging: function (e, t) {
                            return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (t + 1) + "</button>"
                        },
                        dots: !1,
                        dotsClass: "slick-dots",
                        draggable: !0,
                        easing: "linear",
                        edgeFriction: .35,
                        fade: !1,
                        focusOnSelect: !1,
                        infinite: !0,
                        initialSlide: 0,
                        lazyLoad: "ondemand",
                        mobileFirst: !1,
                        pauseOnHover: !0,
                        pauseOnDotsHover: !1,
                        respondTo: "window",
                        responsive: null,
                        rows: 1,
                        rtl: !1,
                        slide: "",
                        slidesPerRow: 1,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        speed: 500,
                        swipe: !0,
                        swipeToSlide: !1,
                        touchMove: !0,
                        touchThreshold: 5,
                        useCSS: !0,
                        useTransform: !1,
                        variableWidth: !1,
                        vertical: !1,
                        verticalSwiping: !1,
                        waitForAnimate: !0,
                        zIndex: 1e3
                    }, o.initials = {
                        animating: !1,
                        dragging: !1,
                        autoPlayTimer: null,
                        currentDirection: 0,
                        currentLeft: null,
                        currentSlide: 0,
                        direction: 1,
                        $dots: null,
                        listWidth: null,
                        listHeight: null,
                        loadIndex: 0,
                        $nextArrow: null,
                        $prevArrow: null,
                        slideCount: null,
                        slideWidth: null,
                        $slideTrack: null,
                        $slides: null,
                        sliding: !1,
                        slideOffset: 0,
                        swipeLeft: null,
                        $list: null,
                        touchObject: {},
                        transformsEnabled: !1,
                        unslicked: !1
                    }, e.extend(o, o.initials), o.activeBreakpoint = null, o.animType = null, o.animProp = null, o.breakpoints = [], o.breakpointSettings = [], o.cssTransitions = !1, o.hidden = "hidden", o.paused = !1, o.positionProp = null, o.respondTo = null, o.rowCount = 1, o.shouldClick = !0, o.$slider = e(t), o.$slidesCache = null, o.transformType = null, o.transitionType = null, o.visibilityChange = "visibilitychange", o.windowWidth = 0, o.windowTimer = null, r = e(t)
                    .data("slick") || {}, o.options = e.extend({}, o.defaults, r, i), o.currentSlide = o.options.initialSlide, o.originalSettings = o.options, "undefined" != typeof document.mozHidden ? (o.hidden = "mozHidden", o.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (o.hidden = "webkitHidden", o.visibilityChange = "webkitvisibilitychange"), o.autoPlay = e.proxy(o.autoPlay, o), o.autoPlayClear = e.proxy(o.autoPlayClear, o), o.changeSlide = e.proxy(o.changeSlide, o), o.clickHandler = e.proxy(o.clickHandler, o), o.selectHandler = e.proxy(o.selectHandler, o), o.setPosition = e.proxy(o.setPosition, o), o.swipeHandler = e.proxy(o.swipeHandler, o), o.dragHandler = e.proxy(o.dragHandler, o), o.keyHandler = e.proxy(o.keyHandler, o), o.autoPlayIterator = e.proxy(o.autoPlayIterator, o), o.instanceUid = n++, o.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, o.registerBreakpoints(), o.init(!0), o.checkResponsive(!0)
            }
            var n = 0;
            return t
        }(), t.prototype.addSlide = t.prototype.slickAdd = function (t, n, i) {
            var r = this;
            if ("boolean" == typeof n) i = n, n = null;
            else if (0 > n || n >= r.slideCount) return !1;
            r.unload(), "number" == typeof n ? 0 === n && 0 === r.$slides.length ? e(t)
                .appendTo(r.$slideTrack) : i ? e(t)
                .insertBefore(r.$slides.eq(n)) : e(t)
                .insertAfter(r.$slides.eq(n)) : i === !0 ? e(t)
                .prependTo(r.$slideTrack) : e(t)
                .appendTo(r.$slideTrack), r.$slides = r.$slideTrack.children(this.options.slide), r.$slideTrack.children(this.options.slide)
                .detach(), r.$slideTrack.append(r.$slides), r.$slides.each(function (t, n) {
                    e(n)
                        .attr("data-slick-index", t)
                }), r.$slidesCache = r.$slides, r.reinit()
        }, t.prototype.animateHeight = function () {
            var e = this;
            if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
                var t = e.$slides.eq(e.currentSlide)
                    .outerHeight(!0);
                e.$list.animate({
                    height: t
                }, e.options.speed)
            }
        }, t.prototype.animateSlide = function (t, n) {
            var i = {},
                r = this;
            r.animateHeight(), r.options.rtl === !0 && r.options.vertical === !1 && (t = -t), r.transformsEnabled === !1 ? r.options.vertical === !1 ? r.$slideTrack.animate({
                left: t
            }, r.options.speed, r.options.easing, n) : r.$slideTrack.animate({
                top: t
            }, r.options.speed, r.options.easing, n) : r.cssTransitions === !1 ? (r.options.rtl === !0 && (r.currentLeft = -r.currentLeft), e({
                    animStart: r.currentLeft
                })
                .animate({
                    animStart: t
                }, {
                    duration: r.options.speed,
                    easing: r.options.easing,
                    step: function (e) {
                        e = Math.ceil(e), r.options.vertical === !1 ? (i[r.animType] = "translate(" + e + "px, 0px)", r.$slideTrack.css(i)) : (i[r.animType] = "translate(0px," + e + "px)", r.$slideTrack.css(i))
                    },
                    complete: function () {
                        n && n.call()
                    }
                })) : (r.applyTransition(), t = Math.ceil(t), r.options.vertical === !1 ? i[r.animType] = "translate3d(" + t + "px, 0px, 0px)" : i[r.animType] = "translate3d(0px," + t + "px, 0px)", r.$slideTrack.css(i), n && setTimeout(function () {
                r.disableTransition(), n.call()
            }, r.options.speed))
        }, t.prototype.asNavFor = function (t) {
            var n = this,
                i = n.options.asNavFor;
            i && null !== i && (i = e(i)
                .not(n.$slider)), null !== i && "object" == typeof i && i.each(function () {
                var n = e(this)
                    .slick("getSlick");
                n.unslicked || n.slideHandler(t, !0)
            })
        }, t.prototype.applyTransition = function (e) {
            var t = this,
                n = {};
            t.options.fade === !1 ? n[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : n[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, t.options.fade === !1 ? t.$slideTrack.css(n) : t.$slides.eq(e)
                .css(n)
        }, t.prototype.autoPlay = function () {
            var e = this;
            e.autoPlayTimer && clearInterval(e.autoPlayTimer), e.slideCount > e.options.slidesToShow && e.paused !== !0 && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
        }, t.prototype.autoPlayClear = function () {
            var e = this;
            e.autoPlayTimer && clearInterval(e.autoPlayTimer)
        }, t.prototype.autoPlayIterator = function () {
            var e = this;
            e.options.infinite === !1 ? 1 === e.direction ? (e.currentSlide + 1 === e.slideCount - 1 && (e.direction = 0), e.slideHandler(e.currentSlide + e.options.slidesToScroll)) : (e.currentSlide - 1 === 0 && (e.direction = 1), e.slideHandler(e.currentSlide - e.options.slidesToScroll)) : e.slideHandler(e.currentSlide + e.options.slidesToScroll)
        }, t.prototype.buildArrows = function () {
            var t = this;
            t.options.arrows === !0 && (t.$prevArrow = e(t.options.prevArrow)
                .addClass("slick-arrow"), t.$nextArrow = e(t.options.nextArrow)
                .addClass("slick-arrow"), t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden")
                    .removeAttr("aria-hidden tabindex"), t.$nextArrow.removeClass("slick-hidden")
                    .removeAttr("aria-hidden tabindex"), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows), t.options.infinite !== !0 && t.$prevArrow.addClass("slick-disabled")
                    .attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow)
                .addClass("slick-hidden")
                .attr({
                    "aria-disabled": "true",
                    tabindex: "-1"
                }))
        }, t.prototype.buildDots = function () {
            var t, n, i = this;
            if (i.options.dots === !0 && i.slideCount > i.options.slidesToShow) {
                for (n = '<ul class="' + i.options.dotsClass + '">', t = 0; t <= i.getDotCount(); t += 1) n += "<li>" + i.options.customPaging.call(this, i, t) + "</li>";
                n += "</ul>", i.$dots = e(n)
                    .appendTo(i.options.appendDots), i.$dots.find("li")
                    .first()
                    .addClass("slick-active")
                    .attr("aria-hidden", "false")
            }
        }, t.prototype.buildOut = function () {
            var t = this;
            t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)")
                .addClass("slick-slide"), t.slideCount = t.$slides.length, t.$slides.each(function (t, n) {
                    e(n)
                        .attr("data-slick-index", t)
                        .data("originalStyling", e(n)
                            .attr("style") || "")
                }), t.$slider.addClass("slick-slider"), t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>')
                .appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>')
                .parent(), t.$list = t.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>')
                .parent(), t.$slideTrack.css("opacity", 0), (t.options.centerMode === !0 || t.options.swipeToSlide === !0) && (t.options.slidesToScroll = 1), e("img[data-lazy]", t.$slider)
                .not("[src]")
                .addClass("slick-loading"), t.setupInfinite(), t.buildArrows(), t.buildDots(), t.updateDots(), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), t.options.draggable === !0 && t.$list.addClass("draggable")
        }, t.prototype.buildRows = function () {
            var e, t, n, i, r, o, s, a = this;
            if (i = document.createDocumentFragment(), o = a.$slider.children(), a.options.rows > 1) {
                for (s = a.options.slidesPerRow * a.options.rows, r = Math.ceil(o.length / s), e = 0; r > e; e++) {
                    var l = document.createElement("div");
                    for (t = 0; t < a.options.rows; t++) {
                        var c = document.createElement("div");
                        for (n = 0; n < a.options.slidesPerRow; n++) {
                            var u = e * s + (t * a.options.slidesPerRow + n);
                            o.get(u) && c.appendChild(o.get(u))
                        }
                        l.appendChild(c)
                    }
                    i.appendChild(l)
                }
                a.$slider.html(i), a.$slider.children()
                    .children()
                    .children()
                    .css({
                        width: 100 / a.options.slidesPerRow + "%",
                        display: "inline-block"
                    })
            }
        }, t.prototype.checkResponsive = function (t, n) {
            var i, r, o, s = this,
                a = !1,
                l = s.$slider.width(),
                c = window.innerWidth || e(window)
                .width();
            if ("window" === s.respondTo ? o = c : "slider" === s.respondTo ? o = l : "min" === s.respondTo && (o = Math.min(c, l)), s.options.responsive && s.options.responsive.length && null !== s.options.responsive) {
                r = null;
                for (i in s.breakpoints) s.breakpoints.hasOwnProperty(i) && (s.originalSettings.mobileFirst === !1 ? o < s.breakpoints[i] && (r = s.breakpoints[i]) : o > s.breakpoints[i] && (r = s.breakpoints[i]));
                null !== r ? null !== s.activeBreakpoint ? (r !== s.activeBreakpoint || n) && (s.activeBreakpoint = r, "unslick" === s.breakpointSettings[r] ? s.unslick(r) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[r]), t === !0 && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = r) : (s.activeBreakpoint = r, "unslick" === s.breakpointSettings[r] ? s.unslick(r) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[r]), t === !0 && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = r) : null !== s.activeBreakpoint && (s.activeBreakpoint = null, s.options = s.originalSettings, t === !0 && (s.currentSlide = s.options.initialSlide), s.refresh(t), a = r), t || a === !1 || s.$slider.trigger("breakpoint", [s, a])
            }
        }, t.prototype.changeSlide = function (t, n) {
            var i, r, o, s = this,
                a = e(t.target);
            switch (a.is("a") && t.preventDefault(), a.is("li") || (a = a.closest("li")), o = s.slideCount % s.options.slidesToScroll !== 0, i = o ? 0 : (s.slideCount - s.currentSlide) % s.options.slidesToScroll, t.data.message) {
            case "previous":
                r = 0 === i ? s.options.slidesToScroll : s.options.slidesToShow - i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide - r, !1, n);
                break;
            case "next":
                r = 0 === i ? s.options.slidesToScroll : i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide + r, !1, n);
                break;
            case "index":
                var l = 0 === t.data.index ? 0 : t.data.index || a.index() * s.options.slidesToScroll;
                s.slideHandler(s.checkNavigable(l), !1, n), a.children()
                    .trigger("focus");
                break;
            default:
                return
            }
        }, t.prototype.checkNavigable = function (e) {
            var t, n, i = this;
            if (t = i.getNavigableIndexes(), n = 0, e > t[t.length - 1]) e = t[t.length - 1];
            else
                for (var r in t) {
                    if (e < t[r]) {
                        e = n;
                        break
                    }
                    n = t[r]
                }
            return e
        }, t.prototype.cleanUpEvents = function () {
            var t = this;
            t.options.dots && null !== t.$dots && (e("li", t.$dots)
                    .off("click.slick", t.changeSlide), t.options.pauseOnDotsHover === !0 && t.options.autoplay === !0 && e("li", t.$dots)
                    .off("mouseenter.slick", e.proxy(t.setPaused, t, !0))
                    .off("mouseleave.slick", e.proxy(t.setPaused, t, !1))), t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide), t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide)), t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler), t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler), t.$list.off("touchend.slick mouseup.slick", t.swipeHandler), t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler), t.$list.off("click.slick", t.clickHandler), e(document)
                .off(t.visibilityChange, t.visibility), t.$list.off("mouseenter.slick", e.proxy(t.setPaused, t, !0)), t.$list.off("mouseleave.slick", e.proxy(t.setPaused, t, !1)), t.options.accessibility === !0 && t.$list.off("keydown.slick", t.keyHandler), t.options.focusOnSelect === !0 && e(t.$slideTrack)
                .children()
                .off("click.slick", t.selectHandler), e(window)
                .off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange), e(window)
                .off("resize.slick.slick-" + t.instanceUid, t.resize), e("[draggable!=true]", t.$slideTrack)
                .off("dragstart", t.preventDefault), e(window)
                .off("load.slick.slick-" + t.instanceUid, t.setPosition), e(document)
                .off("ready.slick.slick-" + t.instanceUid, t.setPosition)
        }, t.prototype.cleanUpRows = function () {
            var e, t = this;
            t.options.rows > 1 && (e = t.$slides.children()
                .children(), e.removeAttr("style"), t.$slider.html(e))
        }, t.prototype.clickHandler = function (e) {
            var t = this;
            t.shouldClick === !1 && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
        }, t.prototype.destroy = function (t) {
            var n = this;
            n.autoPlayClear(), n.touchObject = {}, n.cleanUpEvents(), e(".slick-cloned", n.$slider)
                .detach(), n.$dots && n.$dots.remove(), n.$prevArrow && n.$prevArrow.length && (n.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden")
                    .removeAttr("aria-hidden aria-disabled tabindex")
                    .css("display", ""), n.htmlExpr.test(n.options.prevArrow) && n.$prevArrow.remove()), n.$nextArrow && n.$nextArrow.length && (n.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden")
                    .removeAttr("aria-hidden aria-disabled tabindex")
                    .css("display", ""), n.htmlExpr.test(n.options.nextArrow) && n.$nextArrow.remove()), n.$slides && (n.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current")
                    .removeAttr("aria-hidden")
                    .removeAttr("data-slick-index")
                    .each(function () {
                        e(this)
                            .attr("style", e(this)
                                .data("originalStyling"))
                    }), n.$slideTrack.children(this.options.slide)
                    .detach(), n.$slideTrack.detach(), n.$list.detach(), n.$slider.append(n.$slides)), n.cleanUpRows(), n.$slider.removeClass("slick-slider"), n.$slider.removeClass("slick-initialized"), n.unslicked = !0, t || n.$slider.trigger("destroy", [n])
        }, t.prototype.disableTransition = function (e) {
            var t = this,
                n = {};
            n[t.transitionType] = "", t.options.fade === !1 ? t.$slideTrack.css(n) : t.$slides.eq(e)
                .css(n)
        }, t.prototype.fadeSlide = function (e, t) {
            var n = this;
            n.cssTransitions === !1 ? (n.$slides.eq(e)
                .css({
                    zIndex: n.options.zIndex
                }), n.$slides.eq(e)
                .animate({
                    opacity: 1
                }, n.options.speed, n.options.easing, t)) : (n.applyTransition(e), n.$slides.eq(e)
                .css({
                    opacity: 1,
                    zIndex: n.options.zIndex
                }), t && setTimeout(function () {
                    n.disableTransition(e), t.call()
                }, n.options.speed))
        }, t.prototype.fadeSlideOut = function (e) {
            var t = this;
            t.cssTransitions === !1 ? t.$slides.eq(e)
                .animate({
                    opacity: 0,
                    zIndex: t.options.zIndex - 2
                }, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e)
                    .css({
                        opacity: 0,
                        zIndex: t.options.zIndex - 2
                    }))
        }, t.prototype.filterSlides = t.prototype.slickFilter = function (e) {
            var t = this;
            null !== e && (t.$slidesCache = t.$slides, t.unload(), t.$slideTrack.children(this.options.slide)
                .detach(), t.$slidesCache.filter(e)
                .appendTo(t.$slideTrack), t.reinit())
        }, t.prototype.getCurrent = t.prototype.slickCurrentSlide = function () {
            var e = this;
            return e.currentSlide
        }, t.prototype.getDotCount = function () {
            var e = this,
                t = 0,
                n = 0,
                i = 0;
            if (e.options.infinite === !0)
                for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            else if (e.options.centerMode === !0) i = e.slideCount;
            else
                for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
            return i - 1
        }, t.prototype.getLeft = function (e) {
            var t, n, i, r = this,
                o = 0;
            return r.slideOffset = 0, n = r.$slides.first()
                .outerHeight(!0), r.options.infinite === !0 ? (r.slideCount > r.options.slidesToShow && (r.slideOffset = r.slideWidth * r.options.slidesToShow * -1, o = n * r.options.slidesToShow * -1), r.slideCount % r.options.slidesToScroll !== 0 && e + r.options.slidesToScroll > r.slideCount && r.slideCount > r.options.slidesToShow && (e > r.slideCount ? (r.slideOffset = (r.options.slidesToShow - (e - r.slideCount)) * r.slideWidth * -1, o = (r.options.slidesToShow - (e - r.slideCount)) * n * -1) : (r.slideOffset = r.slideCount % r.options.slidesToScroll * r.slideWidth * -1, o = r.slideCount % r.options.slidesToScroll * n * -1))) : e + r.options.slidesToShow > r.slideCount && (r.slideOffset = (e + r.options.slidesToShow - r.slideCount) * r.slideWidth, o = (e + r.options.slidesToShow - r.slideCount) * n), r.slideCount <= r.options.slidesToShow && (r.slideOffset = 0, o = 0), r.options.centerMode === !0 && r.options.infinite === !0 ? r.slideOffset += r.slideWidth * Math.floor(r.options.slidesToShow / 2) - r.slideWidth : r.options.centerMode === !0 && (r.slideOffset = 0, r.slideOffset += r.slideWidth * Math.floor(r.options.slidesToShow / 2)), t = r.options.vertical === !1 ? e * r.slideWidth * -1 + r.slideOffset : e * n * -1 + o, r.options.variableWidth === !0 && (i = r.slideCount <= r.options.slidesToShow || r.options.infinite === !1 ? r.$slideTrack.children(".slick-slide")
                    .eq(e) : r.$slideTrack.children(".slick-slide")
                    .eq(e + r.options.slidesToShow), t = r.options.rtl === !0 ? i[0] ? -1 * (r.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, r.options.centerMode === !0 && (i = r.slideCount <= r.options.slidesToShow || r.options.infinite === !1 ? r.$slideTrack.children(".slick-slide")
                        .eq(e) : r.$slideTrack.children(".slick-slide")
                        .eq(e + r.options.slidesToShow + 1), t = r.options.rtl === !0 ? i[0] ? -1 * (r.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, t += (r.$list.width() - i.outerWidth()) / 2)), t
        }, t.prototype.getOption = t.prototype.slickGetOption = function (e) {
            var t = this;
            return t.options[e]
        }, t.prototype.getNavigableIndexes = function () {
            var e, t = this,
                n = 0,
                i = 0,
                r = [];
            for (t.options.infinite === !1 ? e = t.slideCount : (n = -1 * t.options.slidesToScroll, i = -1 * t.options.slidesToScroll, e = 2 * t.slideCount); e > n;) r.push(n), n = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
            return r
        }, t.prototype.getSlick = function () {
            return this
        }, t.prototype.getSlideCount = function () {
            var t, n, i, r = this;
            return i = r.options.centerMode === !0 ? r.slideWidth * Math.floor(r.options.slidesToShow / 2) : 0, r.options.swipeToSlide === !0 ? (r.$slideTrack.find(".slick-slide")
                .each(function (t, o) {
                    return o.offsetLeft - i + e(o)
                        .outerWidth() / 2 > -1 * r.swipeLeft ? (n = o, !1) : void 0
                }), t = Math.abs(e(n)
                    .attr("data-slick-index") - r.currentSlide) || 1) : r.options.slidesToScroll
        }, t.prototype.goTo = t.prototype.slickGoTo = function (e, t) {
            var n = this;
            n.changeSlide({
                data: {
                    message: "index",
                    index: parseInt(e)
                }
            }, t)
        }, t.prototype.init = function (t) {
            var n = this;
            e(n.$slider)
                .hasClass("slick-initialized") || (e(n.$slider)
                    .addClass("slick-initialized"), n.buildRows(), n.buildOut(), n.setProps(), n.startLoad(), n.loadSlider(), n.initializeEvents(), n.updateArrows(), n.updateDots()), t && n.$slider.trigger("init", [n]), n.options.accessibility === !0 && n.initADA()
        }, t.prototype.initArrowEvents = function () {
            var e = this;
            e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.on("click.slick", {
                message: "previous"
            }, e.changeSlide), e.$nextArrow.on("click.slick", {
                message: "next"
            }, e.changeSlide))
        }, t.prototype.initDotEvents = function () {
            var t = this;
            t.options.dots === !0 && t.slideCount > t.options.slidesToShow && e("li", t.$dots)
                .on("click.slick", {
                    message: "index"
                }, t.changeSlide), t.options.dots === !0 && t.options.pauseOnDotsHover === !0 && t.options.autoplay === !0 && e("li", t.$dots)
                .on("mouseenter.slick", e.proxy(t.setPaused, t, !0))
                .on("mouseleave.slick", e.proxy(t.setPaused, t, !1))
        }, t.prototype.initializeEvents = function () {
            var t = this;
            t.initArrowEvents(), t.initDotEvents(), t.$list.on("touchstart.slick mousedown.slick", {
                    action: "start"
                }, t.swipeHandler), t.$list.on("touchmove.slick mousemove.slick", {
                    action: "move"
                }, t.swipeHandler), t.$list.on("touchend.slick mouseup.slick", {
                    action: "end"
                }, t.swipeHandler), t.$list.on("touchcancel.slick mouseleave.slick", {
                    action: "end"
                }, t.swipeHandler), t.$list.on("click.slick", t.clickHandler), e(document)
                .on(t.visibilityChange, e.proxy(t.visibility, t)), t.$list.on("mouseenter.slick", e.proxy(t.setPaused, t, !0)), t.$list.on("mouseleave.slick", e.proxy(t.setPaused, t, !1)), t.options.accessibility === !0 && t.$list.on("keydown.slick", t.keyHandler), t.options.focusOnSelect === !0 && e(t.$slideTrack)
                .children()
                .on("click.slick", t.selectHandler), e(window)
                .on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)), e(window)
                .on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)), e("[draggable!=true]", t.$slideTrack)
                .on("dragstart", t.preventDefault), e(window)
                .on("load.slick.slick-" + t.instanceUid, t.setPosition), e(document)
                .on("ready.slick.slick-" + t.instanceUid, t.setPosition)
        }, t.prototype.initUI = function () {
            var e = this;
            e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.show(), e.options.autoplay === !0 && e.autoPlay()
        }, t.prototype.keyHandler = function (e) {
            var t = this;
            e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && t.options.accessibility === !0 ? t.changeSlide({
                data: {
                    message: "previous"
                }
            }) : 39 === e.keyCode && t.options.accessibility === !0 && t.changeSlide({
                data: {
                    message: "next"
                }
            }))
        }, t.prototype.lazyLoad = function () {
            function t(t) {
                e("img[data-lazy]", t)
                    .each(function () {
                        var t = e(this),
                            n = e(this)
                            .attr("data-lazy"),
                            i = document.createElement("img");
                        i.onload = function () {
                            t.animate({
                                opacity: 0
                            }, 100, function () {
                                t.attr("src", n)
                                    .animate({
                                        opacity: 1
                                    }, 200, function () {
                                        t.removeAttr("data-lazy")
                                            .removeClass("slick-loading")
                                    })
                            })
                        }, i.src = n
                    })
            }
            var n, i, r, o, s = this;
            s.options.centerMode === !0 ? s.options.infinite === !0 ? (r = s.currentSlide + (s.options.slidesToShow / 2 + 1), o = r + s.options.slidesToShow + 2) : (r = Math.max(0, s.currentSlide - (s.options.slidesToShow / 2 + 1)), o = 2 + (s.options.slidesToShow / 2 + 1) + s.currentSlide) : (r = s.options.infinite ? s.options.slidesToShow + s.currentSlide : s.currentSlide, o = r + s.options.slidesToShow, s.options.fade === !0 && (r > 0 && r--, o <= s.slideCount && o++)), n = s.$slider.find(".slick-slide")
                .slice(r, o), t(n), s.slideCount <= s.options.slidesToShow ? (i = s.$slider.find(".slick-slide"), t(i)) : s.currentSlide >= s.slideCount - s.options.slidesToShow ? (i = s.$slider.find(".slick-cloned")
                    .slice(0, s.options.slidesToShow), t(i)) : 0 === s.currentSlide && (i = s.$slider.find(".slick-cloned")
                    .slice(-1 * s.options.slidesToShow), t(i))
        }, t.prototype.loadSlider = function () {
            var e = this;
            e.setPosition(), e.$slideTrack.css({
                opacity: 1
            }), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
        }, t.prototype.next = t.prototype.slickNext = function () {
            var e = this;
            e.changeSlide({
                data: {
                    message: "next"
                }
            })
        }, t.prototype.orientationChange = function () {
            var e = this;
            e.checkResponsive(), e.setPosition()
        }, t.prototype.pause = t.prototype.slickPause = function () {
            var e = this;
            e.autoPlayClear(), e.paused = !0
        }, t.prototype.play = t.prototype.slickPlay = function () {
            var e = this;
            e.paused = !1, e.autoPlay()
        }, t.prototype.postSlide = function (e) {
            var t = this;
            t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.setPosition(), t.swipeLeft = null, t.options.autoplay === !0 && t.paused === !1 && t.autoPlay(), t.options.accessibility === !0 && t.initADA()
        }, t.prototype.prev = t.prototype.slickPrev = function () {
            var e = this;
            e.changeSlide({
                data: {
                    message: "previous"
                }
            })
        }, t.prototype.preventDefault = function (e) {
            e.preventDefault()
        }, t.prototype.progressiveLazyLoad = function () {
            var t, n, i = this;
            t = e("img[data-lazy]", i.$slider)
                .length, t > 0 && (n = e("img[data-lazy]", i.$slider)
                    .first(), n.attr("src", null), n.attr("src", n.attr("data-lazy"))
                    .removeClass("slick-loading")
                    .load(function () {
                        n.removeAttr("data-lazy"), i.progressiveLazyLoad(), i.options.adaptiveHeight === !0 && i.setPosition()
                    })
                    .error(function () {
                        n.removeAttr("data-lazy"), i.progressiveLazyLoad()
                    }))
        }, t.prototype.refresh = function (t) {
            var n, i, r = this;
            i = r.slideCount - r.options.slidesToShow, r.options.infinite || (r.slideCount <= r.options.slidesToShow ? r.currentSlide = 0 : r.currentSlide > i && (r.currentSlide = i)), n = r.currentSlide, r.destroy(!0), e.extend(r, r.initials, {
                currentSlide: n
            }), r.init(), t || r.changeSlide({
                data: {
                    message: "index",
                    index: n
                }
            }, !1)
        }, t.prototype.registerBreakpoints = function () {
            var t, n, i, r = this,
                o = r.options.responsive || null;
            if ("array" === e.type(o) && o.length) {
                r.respondTo = r.options.respondTo || "window";
                for (t in o)
                    if (i = r.breakpoints.length - 1, n = o[t].breakpoint, o.hasOwnProperty(t)) {
                        for (; i >= 0;) r.breakpoints[i] && r.breakpoints[i] === n && r.breakpoints.splice(i, 1), i--;
                        r.breakpoints.push(n), r.breakpointSettings[n] = o[t].settings
                    }
                r.breakpoints.sort(function (e, t) {
                    return r.options.mobileFirst ? e - t : t - e
                })
            }
        }, t.prototype.reinit = function () {
            var t = this;
            t.$slides = t.$slideTrack.children(t.options.slide)
                .addClass("slick-slide"), t.slideCount = t.$slides.length, t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll), t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0), t.registerBreakpoints(), t.setProps(), t.setupInfinite(), t.buildArrows(), t.updateArrows(), t.initArrowEvents(), t.buildDots(), t.updateDots(), t.initDotEvents(), t.checkResponsive(!1, !0), t.options.focusOnSelect === !0 && e(t.$slideTrack)
                .children()
                .on("click.slick", t.selectHandler), t.setSlideClasses(0), t.setPosition(), t.$slider.trigger("reInit", [t]), t.options.autoplay === !0 && t.focusHandler()
        }, t.prototype.resize = function () {
            var t = this;
            e(window)
                .width() !== t.windowWidth && (clearTimeout(t.windowDelay), t.windowDelay = window.setTimeout(function () {
                    t.windowWidth = e(window)
                        .width(), t.checkResponsive(), t.unslicked || t.setPosition()
                }, 50))
        }, t.prototype.removeSlide = t.prototype.slickRemove = function (e, t, n) {
            var i = this;
            return "boolean" == typeof e ? (t = e, e = t === !0 ? 0 : i.slideCount - 1) : e = t === !0 ? --e : e, i.slideCount < 1 || 0 > e || e > i.slideCount - 1 ? !1 : (i.unload(), n === !0 ? i.$slideTrack.children()
                .remove() : i.$slideTrack.children(this.options.slide)
                .eq(e)
                .remove(), i.$slides = i.$slideTrack.children(this.options.slide), i.$slideTrack.children(this.options.slide)
                .detach(), i.$slideTrack.append(i.$slides), i.$slidesCache = i.$slides, void i.reinit())
        }, t.prototype.setCSS = function (e) {
            var t, n, i = this,
                r = {};
            i.options.rtl === !0 && (e = -e), t = "left" == i.positionProp ? Math.ceil(e) + "px" : "0px", n = "top" == i.positionProp ? Math.ceil(e) + "px" : "0px", r[i.positionProp] = e, i.transformsEnabled === !1 ? i.$slideTrack.css(r) : (r = {}, i.cssTransitions === !1 ? (r[i.animType] = "translate(" + t + ", " + n + ")", i.$slideTrack.css(r)) : (r[i.animType] = "translate3d(" + t + ", " + n + ", 0px)", i.$slideTrack.css(r)))
        }, t.prototype.setDimensions = function () {
            var e = this;
            e.options.vertical === !1 ? e.options.centerMode === !0 && e.$list.css({
                padding: "0px " + e.options.centerPadding
            }) : (e.$list.height(e.$slides.first()
                .outerHeight(!0) * e.options.slidesToShow), e.options.centerMode === !0 && e.$list.css({
                padding: e.options.centerPadding + " 0px"
            })), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), e.options.vertical === !1 && e.options.variableWidth === !1 ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide")
                .length))) : e.options.variableWidth === !0 ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first()
                .outerHeight(!0) * e.$slideTrack.children(".slick-slide")
                .length)));
            var t = e.$slides.first()
                .outerWidth(!0) - e.$slides.first()
                .width();
            e.options.variableWidth === !1 && e.$slideTrack.children(".slick-slide")
                .width(e.slideWidth - t)
        }, t.prototype.setFade = function () {
            var t, n = this;
            n.$slides.each(function (i, r) {
                    t = n.slideWidth * i * -1, n.options.rtl === !0 ? e(r)
                        .css({
                            position: "relative",
                            right: t,
                            top: 0,
                            zIndex: n.options.zIndex - 2,
                            opacity: 0
                        }) : e(r)
                        .css({
                            position: "relative",
                            left: t,
                            top: 0,
                            zIndex: n.options.zIndex - 2,
                            opacity: 0
                        })
                }), n.$slides.eq(n.currentSlide)
                .css({
                    zIndex: n.options.zIndex - 1,
                    opacity: 1
                })
        }, t.prototype.setHeight = function () {
            var e = this;
            if (1 === e.options.slidesToShow && e.options.adaptiveHeight === !0 && e.options.vertical === !1) {
                var t = e.$slides.eq(e.currentSlide)
                    .outerHeight(!0);
                e.$list.css("height", t)
            }
        }, t.prototype.setOption = t.prototype.slickSetOption = function (t, n, i) {
            var r, o, s = this;
            if ("responsive" === t && "array" === e.type(n))
                for (o in n)
                    if ("array" !== e.type(s.options.responsive)) s.options.responsive = [n[o]];
                    else {
                        for (r = s.options.responsive.length - 1; r >= 0;) s.options.responsive[r].breakpoint === n[o].breakpoint && s.options.responsive.splice(r, 1), r--;
                        s.options.responsive.push(n[o])
                    }
            else s.options[t] = n;
            i === !0 && (s.unload(), s.reinit())
        }, t.prototype.setPosition = function () {
            var e = this;
            e.setDimensions(), e.setHeight(), e.options.fade === !1 ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
        }, t.prototype.setProps = function () {
            var e = this,
                t = document.body.style;
            e.positionProp = e.options.vertical === !0 ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), (void 0 !== t.WebkitTransition || void 0 !== t.MozTransition || void 0 !== t.msTransition) && e.options.useCSS === !0 && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), void 0 !== t.OTransform && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.MozTransform && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)), void 0 !== t.webkitTransform && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.msTransform && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", void 0 === t.msTransform && (e.animType = !1)), void 0 !== t.transform && e.animType !== !1 && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && null !== e.animType && e.animType !== !1
        }, t.prototype.setSlideClasses = function (e) {
            var t, n, i, r, o = this;
            n = o.$slider.find(".slick-slide")
                .removeClass("slick-active slick-center slick-current")
                .attr("aria-hidden", "true"), o.$slides.eq(e)
                .addClass("slick-current"), o.options.centerMode === !0 ? (t = Math.floor(o.options.slidesToShow / 2), o.options.infinite === !0 && (e >= t && e <= o.slideCount - 1 - t ? o.$slides.slice(e - t, e + t + 1)
                        .addClass("slick-active")
                        .attr("aria-hidden", "false") : (i = o.options.slidesToShow + e, n.slice(i - t + 1, i + t + 2)
                            .addClass("slick-active")
                            .attr("aria-hidden", "false")), 0 === e ? n.eq(n.length - 1 - o.options.slidesToShow)
                        .addClass("slick-center") : e === o.slideCount - 1 && n.eq(o.options.slidesToShow)
                        .addClass("slick-center")), o.$slides.eq(e)
                    .addClass("slick-center")) : e >= 0 && e <= o.slideCount - o.options.slidesToShow ? o.$slides.slice(e, e + o.options.slidesToShow)
                .addClass("slick-active")
                .attr("aria-hidden", "false") : n.length <= o.options.slidesToShow ? n.addClass("slick-active")
                .attr("aria-hidden", "false") : (r = o.slideCount % o.options.slidesToShow, i = o.options.infinite === !0 ? o.options.slidesToShow + e : e, o.options.slidesToShow == o.options.slidesToScroll && o.slideCount - e < o.options.slidesToShow ? n.slice(i - (o.options.slidesToShow - r), i + r)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false") : n.slice(i, i + o.options.slidesToShow)
                    .addClass("slick-active")
                    .attr("aria-hidden", "false")), "ondemand" === o.options.lazyLoad && o.lazyLoad()
        }, t.prototype.setupInfinite = function () {
            var t, n, i, r = this;
            if (r.options.fade === !0 && (r.options.centerMode = !1), r.options.infinite === !0 && r.options.fade === !1 && (n = null, r.slideCount > r.options.slidesToShow)) {
                for (i = r.options.centerMode === !0 ? r.options.slidesToShow + 1 : r.options.slidesToShow, t = r.slideCount; t > r.slideCount - i; t -= 1) n = t - 1, e(r.$slides[n])
                    .clone(!0)
                    .attr("id", "")
                    .attr("data-slick-index", n - r.slideCount)
                    .prependTo(r.$slideTrack)
                    .addClass("slick-cloned");
                for (t = 0; i > t; t += 1) n = t, e(r.$slides[n])
                    .clone(!0)
                    .attr("id", "")
                    .attr("data-slick-index", n + r.slideCount)
                    .appendTo(r.$slideTrack)
                    .addClass("slick-cloned");
                r.$slideTrack.find(".slick-cloned")
                    .find("[id]")
                    .each(function () {
                        e(this)
                            .attr("id", "")
                    })
            }
        }, t.prototype.setPaused = function (e) {
            var t = this;
            t.options.autoplay === !0 && t.options.pauseOnHover === !0 && (t.paused = e, e ? t.autoPlayClear() : t.autoPlay())
        }, t.prototype.selectHandler = function (t) {
            var n = this,
                i = e(t.target)
                .is(".slick-slide") ? e(t.target) : e(t.target)
                .parents(".slick-slide"),
                r = parseInt(i.attr("data-slick-index"));
            return r || (r = 0), n.slideCount <= n.options.slidesToShow ? (n.setSlideClasses(r), void n.asNavFor(r)) : void n.slideHandler(r)
        }, t.prototype.slideHandler = function (e, t, n) {
            var i, r, o, s, a = null,
                l = this;
            return t = t || !1, l.animating === !0 && l.options.waitForAnimate === !0 || l.options.fade === !0 && l.currentSlide === e || l.slideCount <= l.options.slidesToShow ? void 0 : (t === !1 && l.asNavFor(e), i = e, a = l.getLeft(i), s = l.getLeft(l.currentSlide), l.currentLeft = null === l.swipeLeft ? s : l.swipeLeft, l.options.infinite === !1 && l.options.centerMode === !1 && (0 > e || e > l.getDotCount() * l.options.slidesToScroll) ? void(l.options.fade === !1 && (i = l.currentSlide, n !== !0 ? l.animateSlide(s, function () {
                l.postSlide(i)
            }) : l.postSlide(i))) : l.options.infinite === !1 && l.options.centerMode === !0 && (0 > e || e > l.slideCount - l.options.slidesToScroll) ? void(l.options.fade === !1 && (i = l.currentSlide, n !== !0 ? l.animateSlide(s, function () {
                l.postSlide(i)
            }) : l.postSlide(i))) : (l.options.autoplay === !0 && clearInterval(l.autoPlayTimer), r = 0 > i ? l.slideCount % l.options.slidesToScroll !== 0 ? l.slideCount - l.slideCount % l.options.slidesToScroll : l.slideCount + i : i >= l.slideCount ? l.slideCount % l.options.slidesToScroll !== 0 ? 0 : i - l.slideCount : i, l.animating = !0, l.$slider.trigger("beforeChange", [l, l.currentSlide, r]), o = l.currentSlide, l.currentSlide = r, l.setSlideClasses(l.currentSlide), l.updateDots(), l.updateArrows(), l.options.fade === !0 ? (n !== !0 ? (l.fadeSlideOut(o), l.fadeSlide(r, function () {
                l.postSlide(r)
            })) : l.postSlide(r), void l.animateHeight()) : void(n !== !0 ? l.animateSlide(a, function () {
                l.postSlide(r)
            }) : l.postSlide(r))))
        }, t.prototype.startLoad = function () {
            var e = this;
            e.options.arrows === !0 && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), e.options.dots === !0 && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
        }, t.prototype.swipeDirection = function () {
            var e, t, n, i, r = this;
            return e = r.touchObject.startX - r.touchObject.curX, t = r.touchObject.startY - r.touchObject.curY, n = Math.atan2(t, e), i = Math.round(180 * n / Math.PI), 0 > i && (i = 360 - Math.abs(i)), 45 >= i && i >= 0 ? r.options.rtl === !1 ? "left" : "right" : 360 >= i && i >= 315 ? r.options.rtl === !1 ? "left" : "right" : i >= 135 && 225 >= i ? r.options.rtl === !1 ? "right" : "left" : r.options.verticalSwiping === !0 ? i >= 35 && 135 >= i ? "left" : "right" : "vertical"
        }, t.prototype.swipeEnd = function (e) {
            var t, n = this;
            if (n.dragging = !1, n.shouldClick = n.touchObject.swipeLength > 10 ? !1 : !0, void 0 === n.touchObject.curX) return !1;
            if (n.touchObject.edgeHit === !0 && n.$slider.trigger("edge", [n, n.swipeDirection()]), n.touchObject.swipeLength >= n.touchObject.minSwipe) switch (n.swipeDirection()) {
            case "left":
                t = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide + n.getSlideCount()) : n.currentSlide + n.getSlideCount(), n.slideHandler(t), n.currentDirection = 0, n.touchObject = {}, n.$slider.trigger("swipe", [n, "left"]);
                break;
            case "right":
                t = n.options.swipeToSlide ? n.checkNavigable(n.currentSlide - n.getSlideCount()) : n.currentSlide - n.getSlideCount(), n.slideHandler(t), n.currentDirection = 1, n.touchObject = {}, n.$slider.trigger("swipe", [n, "right"])
            } else n.touchObject.startX !== n.touchObject.curX && (n.slideHandler(n.currentSlide), n.touchObject = {})
        }, t.prototype.swipeHandler = function (e) {
            var t = this;
            if (!(t.options.swipe === !1 || "ontouchend" in document && t.options.swipe === !1 || t.options.draggable === !1 && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, t.options.verticalSwiping === !0 && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
            case "start":
                t.swipeStart(e);
                break;
            case "move":
                t.swipeMove(e);
                break;
            case "end":
                t.swipeEnd(e)
            }
        }, t.prototype.swipeMove = function (e) {
            var t, n, i, r, o, s = this;
            return o = void 0 !== e.originalEvent ? e.originalEvent.touches : null, !s.dragging || o && 1 !== o.length ? !1 : (t = s.getLeft(s.currentSlide), s.touchObject.curX = void 0 !== o ? o[0].pageX : e.clientX, s.touchObject.curY = void 0 !== o ? o[0].pageY : e.clientY, s.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(s.touchObject.curX - s.touchObject.startX, 2))), s.options.verticalSwiping === !0 && (s.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(s.touchObject.curY - s.touchObject.startY, 2)))), n = s.swipeDirection(), "vertical" !== n ? (void 0 !== e.originalEvent && s.touchObject.swipeLength > 4 && e.preventDefault(), r = (s.options.rtl === !1 ? 1 : -1) * (s.touchObject.curX > s.touchObject.startX ? 1 : -1), s.options.verticalSwiping === !0 && (r = s.touchObject.curY > s.touchObject.startY ? 1 : -1), i = s.touchObject.swipeLength, s.touchObject.edgeHit = !1, s.options.infinite === !1 && (0 === s.currentSlide && "right" === n || s.currentSlide >= s.getDotCount() && "left" === n) && (i = s.touchObject.swipeLength * s.options.edgeFriction, s.touchObject.edgeHit = !0), s.options.vertical === !1 ? s.swipeLeft = t + i * r : s.swipeLeft = t + i * (s.$list.height() / s.listWidth) * r, s.options.verticalSwiping === !0 && (s.swipeLeft = t + i * r), s.options.fade === !0 || s.options.touchMove === !1 ? !1 : s.animating === !0 ? (s.swipeLeft = null, !1) : void s.setCSS(s.swipeLeft)) : void 0)
        }, t.prototype.swipeStart = function (e) {
            var t, n = this;
            return 1 !== n.touchObject.fingerCount || n.slideCount <= n.options.slidesToShow ? (n.touchObject = {}, !1) : (void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]), n.touchObject.startX = n.touchObject.curX = void 0 !== t ? t.pageX : e.clientX, n.touchObject.startY = n.touchObject.curY = void 0 !== t ? t.pageY : e.clientY, void(n.dragging = !0))
        }, t.prototype.unfilterSlides = t.prototype.slickUnfilter = function () {
            var e = this;
            null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide)
                .detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
        }, t.prototype.unload = function () {
            var t = this;
            e(".slick-cloned", t.$slider)
                .remove(), t.$dots && t.$dots.remove(), t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(), t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(), t.$slides.removeClass("slick-slide slick-active slick-visible slick-current")
                .attr("aria-hidden", "true")
                .css("width", "")
        }, t.prototype.unslick = function (e) {
            var t = this;
            t.$slider.trigger("unslick", [t, e]), t.destroy()
        }, t.prototype.updateArrows = function () {
            var e, t = this;
            e = Math.floor(t.options.slidesToShow / 2), t.options.arrows === !0 && t.slideCount > t.options.slidesToShow && !t.options.infinite && (t.$prevArrow.removeClass("slick-disabled")
                .attr("aria-disabled", "false"), t.$nextArrow.removeClass("slick-disabled")
                .attr("aria-disabled", "false"), 0 === t.currentSlide ? (t.$prevArrow.addClass("slick-disabled")
                    .attr("aria-disabled", "true"), t.$nextArrow.removeClass("slick-disabled")
                    .attr("aria-disabled", "false")) : t.currentSlide >= t.slideCount - t.options.slidesToShow && t.options.centerMode === !1 ? (t.$nextArrow.addClass("slick-disabled")
                    .attr("aria-disabled", "true"), t.$prevArrow.removeClass("slick-disabled")
                    .attr("aria-disabled", "false")) : t.currentSlide >= t.slideCount - 1 && t.options.centerMode === !0 && (t.$nextArrow.addClass("slick-disabled")
                    .attr("aria-disabled", "true"), t.$prevArrow.removeClass("slick-disabled")
                    .attr("aria-disabled", "false")))
        }, t.prototype.updateDots = function () {
            var e = this;
            null !== e.$dots && (e.$dots.find("li")
                .removeClass("slick-active")
                .attr("aria-hidden", "true"), e.$dots.find("li")
                .eq(Math.floor(e.currentSlide / e.options.slidesToScroll))
                .addClass("slick-active")
                .attr("aria-hidden", "false"))
        }, t.prototype.visibility = function () {
            var e = this;
            document[e.hidden] ? (e.paused = !0, e.autoPlayClear()) : e.options.autoplay === !0 && (e.paused = !1, e.autoPlay())
        }, t.prototype.initADA = function () {
            var t = this;
            t.$slides.add(t.$slideTrack.find(".slick-cloned"))
                .attr({
                    "aria-hidden": "true",
                    tabindex: "-1"
                })
                .find("a, input, button, select")
                .attr({
                    tabindex: "-1"
                }), t.$slideTrack.attr("role", "listbox"), t.$slides.not(t.$slideTrack.find(".slick-cloned"))
                .each(function (n) {
                    e(this)
                        .attr({
                            role: "option",
                            "aria-describedby": "slick-slide" + t.instanceUid + n
                        })
                }), null !== t.$dots && t.$dots.attr("role", "tablist")
                .find("li")
                .each(function (n) {
                    e(this)
                        .attr({
                            role: "presentation",
                            "aria-selected": "false",
                            "aria-controls": "navigation" + t.instanceUid + n,
                            id: "slick-slide" + t.instanceUid + n
                        })
                })
                .first()
                .attr("aria-selected", "true")
                .end()
                .find("button")
                .attr("role", "button")
                .end()
                .closest("div")
                .attr("role", "toolbar"), t.activateADA()
        }, t.prototype.activateADA = function () {
            var e = this;
            e.$slideTrack.find(".slick-active")
                .attr({
                    "aria-hidden": "false"
                })
                .find("a, input, button, select")
                .attr({
                    tabindex: "0"
                })
        }, t.prototype.focusHandler = function () {
            var t = this;
            t.$slider.on("focus.slick blur.slick", "*", function (n) {
                n.stopImmediatePropagation();
                var i = e(this);
                setTimeout(function () {
                    t.isPlay && (i.is(":focus") ? (t.autoPlayClear(), t.paused = !0) : (t.paused = !1, t.autoPlay()))
                }, 0)
            })
        }, e.fn.slick = function () {
            var e, n, i = this,
                r = arguments[0],
                o = Array.prototype.slice.call(arguments, 1),
                s = i.length;
            for (e = 0; s > e; e++)
                if ("object" == typeof r || "undefined" == typeof r ? i[e].slick = new t(i[e], r) : n = i[e].slick[r].apply(i[e].slick, o), "undefined" != typeof n) return n;
            return i
        }
    }), /*! JsRender v1.0.0-rc.70 (Beta - Release Candidate): http://jsviews.com/#jsrender */
    /*! **VERSION FOR WEB** (For NODE.JS see http://jsviews.com/download/jsrender-node.js) */
    /*
     * Best-of-breed templating in browser or on Node.js.
     * Does not require jQuery, or HTML DOM
     * Integrates with JsViews (http://jsviews.com/#jsviews)
     *
     * Copyright 2015, Boris Moore
     * Released under the MIT License.
     */
    function (e) {
        var t = (0, eval)("this"),
            n = t.jQuery;
        "function" == typeof define && define.amd ? define(e) : "object" == typeof exports ? module.exports = n ? e(n) : function (t) {
            if (t && !t.fn) throw "Provide jQuery or null";
            return e(t)
        } : e(!1)
    }(function (e) {
        "use strict";

        function t(e, t) {
            return function () {
                var n, i = this,
                    r = i.base;
                return i.base = e, n = t.apply(i, arguments), i.base = r, n
            }
        }

        function n(e, n) {
            return X(n) && (n = t(e ? e._d ? e : t(o, e) : o, n), n._d = 1), n
        }

        function i(e, t) {
            for (var i in t.props) we.test(i) && (e[i] = n(e[i], t.props[i]))
        }

        function r(e) {
            return e
        }

        function o() {
            return ""
        }

        function s(e) {
            try {
                throw "dbg breakpoint"
            } catch (t) {}
            return this.base ? this.baseApply(arguments) : e
        }

        function a(e) {
            ne._dbgMode = e !== !1
        }

        function l(t) {
            this.name = (e.link ? "JsViews" : "JsRender") + " Error", this.message = t || this.name
        }

        function c(e, t) {
            var n;
            for (n in t) e[n] = t[n];
            return e
        }

        function u(e, t, n) {
            return (0 !== this || e) && (oe = e ? e.charAt(0) : oe, se = e ? e.charAt(1) : se, ae = t ? t.charAt(0) : ae, le = t ? t.charAt(1) : le, ce = n || ce, e = "\\" + oe + "(\\" + ce + ")?\\" + se, t = "\\" + ae + "\\" + le, B = "(?:(?:(\\w+(?=[\\/\\s\\" + ae + "]))|(?:(\\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\\*)))\\s*((?:[^\\" + ae + "]|\\" + ae + "(?!\\" + le + "))*?)", te.rTag = B + ")", B = new RegExp(e + B + "(\\/)?|(?:\\/(\\w+)))" + t, "g"), V = new RegExp("<.*>|([^\\\\]|^)[{}]|" + e + ".*" + t)), [oe, se, ae, le, ce]
        }

        function d(e, t) {
            t || (t = e, e = void 0);
            var n, i, r, o, s = this,
                a = !t || "root" === t;
            if (e) {
                if (o = s.type === t ? s : void 0, !o)
                    if (n = s.views, s._.useKey) {
                        for (i in n)
                            if (o = n[i].get(e, t)) break
                    } else
                        for (i = 0, r = n.length; !o && r > i; i++) o = n[i].get(e, t)
            } else if (a)
                for (; s.parent.parent;) o = s = s.parent;
            else
                for (; s && !o;) o = s.type === t ? s : void 0, s = s.parent;
            return o
        }

        function p() {
            var e = this.get("item");
            return e ? e.index : void 0
        }

        function f() {
            return this.index
        }

        function h(e) {
            var t, n = this,
                i = n.linkCtx,
                r = (n.ctx || {})[e];
            return void 0 === r && i && i.ctx && (r = i.ctx[e]), void 0 === r && (r = Z[e]), r && X(r) && !r._wrp && (t = function () {
                return r.apply(this && this !== z ? this : n, arguments)
            }, t._wrp = !0, c(t, r)), t || r
        }

        function g(e, t, n, r) {
            var o, s, a = "number" == typeof n && t.tmpl.bnds[n - 1],
                l = t.linkCtx;
            return void 0 !== r ? n = r = {
                props: {},
                args: [r]
            } : a && (n = a(t.data, t, Y)), s = n.args[0], (e || a) && (o = l && l.tag, o || (o = c(new te._tg, {
                _: {
                    inline: !l,
                    bnd: a,
                    unlinked: !0
                },
                tagName: ":",
                cvt: e,
                flow: !0,
                tagCtx: n
            }), l && (l.tag = o, o.linkCtx = l), n.ctx = R(n.ctx, (l ? l.view : t)
                .ctx)), o._er = r && s, i(o, n), n.view = t, o.ctx = n.ctx || {}, n.ctx = void 0, t._.tag = o, s = o.cvtArgs(o.convert || "true" !== e && e)[0], s = a && t._.onRender ? t._.onRender(s, t, a) : s, t._.tag = void 0), void 0 != s ? s : ""
        }

        function v(e) {
            var t = this,
                n = t.tagCtx,
                i = n.view,
                r = n.args;
            return e = t.convert || e, e = e && ("" + e === e ? i.getRsc("converters", e) || E("Unknown converter: '" + e + "'") : e), r = r.length || n.index ? e ? r.slice() : r : [i.data], e && (e.depends && (t.depends = te.getDeps(t.depends, t, e.depends, e)), r[0] = e.apply(t, r)), r
        }

        function m(e, t) {
            for (var n, i, r = this; void 0 === n && r;) i = r.tmpl && r.tmpl[e], n = i && i[t], r = r.parent;
            return n || Y[e][t]
        }

        function y(e, t, n, r, o, s) {
            t = t || J;
            var a, l, c, u, d, p, f, h, g, v, m, y, b, w, x, _, $, k, T, C = "",
                A = t.linkCtx || 0,
                j = t.ctx,
                O = n || t.tmpl,
                D = "number" == typeof r && t.tmpl.bnds[r - 1];
            for ("tag" === e._is ? (a = e, e = a.tagName, r = a.tagCtxs, c = a.template) : (l = t.getRsc("tags", e) || E("Unknown tag: {{" + e + "}} "), c = l.template), void 0 !== s ? (C += s, r = s = [{
                    props: {},
                    args: []
                }]) : D && (r = D(t.data, t, Y)), h = r.length, f = 0; h > f; f++) v = r[f], (!A || !A.tag || f && !A.tag._.inline || a._er) && ((y = v.tmpl) && (y = v.content = O.tmpls[y - 1]), v.index = f, v.tmpl = c || y, v.render = S, v.view = t, v.ctx = R(v.ctx, j)), (n = v.props.tmpl) && (n = "" + n === n ? t.getRsc("templates", n) || K(n) : n, v.tmpl = n), a || (a = new l._ctr, b = !!a.init, a.parent = p = j && j.tag, a.tagCtxs = r, T = a.dataMap, A && (a._.inline = !1, A.tag = a, a.linkCtx = A), (a._.bnd = D || A.fn) ? a._.arrVws = {} : a.dataBoundOnly && E("{^{" + e + "}} tag must be data-bound")), r = a.tagCtxs, T = a.dataMap, v.tag = a, T && r && (v.map = r[f].map), a.flow || (m = v.ctx = v.ctx || {}, u = a.parents = m.parentTags = j && R(m.parentTags, j.parentTags) || {}, p && (u[p.tagName] = p), u[a.tagName] = m.tag = a);
            if ((D || A) && (t._.tag = a), !(a._er = s)) {
                for (i(a, r[0]), a.rendering = {}, f = 0; h > f; f++) v = a.tagCtx = r[f], $ = v.props, _ = a.cvtArgs(), (w = $.dataMap || T) && (_.length || $.dataMap) && (x = v.map, (!x || x.src !== _[0] || o) && (x && x.src && x.unmap(), x = v.map = w.map(_[0], $, void 0, !a._.bnd)), _ = [x.tgt]), a.ctx = v.ctx, f || (b && (k = a.template, a.init(v, A, a.ctx), b = void 0, a.template !== k && (a._.tmpl = a.template)), A && (A.attr = a.attr = A.attr || a.attr), d = a.attr, a._.noVws = d && d !== ke), g = void 0, a.render && (g = a.render.apply(a, _)), _.length || (_ = [t]), void 0 === g && (g = v.render(_.length ? _[0] : t, !0) || (o ? void 0 : "")), C = C ? C + (g || "") : g;
                a.rendering = void 0
            }
            return a.tagCtx = r[0], a.ctx = a.tagCtx.ctx, a._.noVws && a._.inline && (C = "text" === d ? Q.html(C) : ""), D && t._.onRender ? t._.onRender(C, t, D) : C
        }

        function b(e, t, n, i, r, o, s, a) {
            var l, c, u, d, f = this,
                h = "array" === t;
            f.content = s, f.views = h ? [] : {}, f.parent = n, f.type = t || "top", f.data = i, f.tmpl = r, d = f._ = {
                key: 0,
                useKey: h ? 0 : 1,
                id: "" + _e++,
                onRender: a,
                bnds: {}
            }, f.linked = !!a, n ? (l = n.views, c = n._, c.useKey ? (l[d.key = "_" + c.useKey++] = f, f.index = Ae, f.getIndex = p, u = c.tag, d.bnd = h && (!u || !!u._.bnd && u)) : l.length === (d.key = f.index = o) ? l.push(f) : l.splice(o, 0, f), f.ctx = e || n.ctx) : f.ctx = e
        }

        function w(e) {
            var t, n, i, r, o, s, a;
            for (t in De)
                if (o = De[t], (s = o.compile) && (n = e[t + "s"]))
                    for (i in n) r = n[i] = s(i, n[i], e, 0), r._is = t, r && (a = te.onStore[t]) && a(i, r, s)
        }

        function x(e, t, i) {
            function r() {
                var t = this;
                t._ = {
                    inline: !0,
                    unlinked: !0
                }, t.tagName = e
            }
            var o, s, a, l = new te._tg;
            if (X(t) ? t = {
                    depends: t.depends,
                    render: t
                } : "" + t === t && (t = {
                    template: t
                }), s = t.baseTag) {
                t.flow = !!t.flow, t.baseTag = s = "" + s === s ? i && i.tags[s] || ee[s] : s, l = c(l, s);
                for (a in t) l[a] = n(s[a], t[a])
            } else l = c(l, t);
            return void 0 !== (o = l.template) && (l.template = "" + o === o ? K[o] || K(o) : o), l.init !== !1 && ((r.prototype = l)
                .constructor = l._ctr = r), i && (l._parentTmpl = i), l
        }

        function _(e) {
            return this.base.apply(this, e)
        }

        function $(t, n, i, r) {
            function o(n) {
                var o, a;
                if ("" + n === n || n.nodeType > 0 && (s = n)) {
                    if (!s)
                        if (/^\.\/[^\\:*?"<>]*$/.test(n))(a = K[t = t || n]) ? n = a : s = document.getElementById(n);
                        else if (e.fn && !V.test(n)) try {
                        s = e(document)
                            .find(n)[0]
                    } catch (l) {}
                    s && (r ? n = s.innerHTML : (o = s.getAttribute(Ce), o ? o !== Se ? (n = K[o], delete K[o]) : e.fn && (n = e.data(s)[Se]) : (t = t || (e.fn ? Se : n), n = $(t, s.innerHTML, i, r)), n.tmplName = t = t || o, t !== Se && (K[t] = n), s.setAttribute(Ce, t), e.fn && e.data(s, Se, n))), s = void 0
                } else n.fn || (n = void 0);
                return n
            }
            var s, a, l = n = n || "";
            return 0 === r && (r = void 0, l = o(l)), r = r || (n.markup ? n : {}), r.tmplName = t, i && (r._parentTmpl = i), !l && n.markup && (l = o(n.markup)) && l.fn && (l = l.markup), void 0 !== l ? (l.fn || n.fn ? l.fn && (a = l) : (n = T(l, r), O(l.replace(he, "\\$&"), n)), a || (w(r), a = c(function () {
                return n.render.apply(n, arguments)
            }, n)), t && !i && t !== Se && (Ee[t] = a), a) : void 0
        }

        function k(e) {
            function t(t, n) {
                this.tgt = e.getTgt(t, n)
            }
            return X(e) && (e = {
                getTgt: e
            }), e.baseMap && (e = c(c({}, e.baseMap), e)), e.map = function (e, n) {
                return new t(e, n)
            }, e
        }

        function T(t, n) {
            var i, r = ne.wrapMap || {},
                o = c({
                    tmpls: [],
                    links: {},
                    bnds: [],
                    _is: "template",
                    render: S
                }, n);
            return o.markup = t, n.htmlTag || (i = me.exec(t), o.htmlTag = i ? i[1].toLowerCase() : ""), i = r[o.htmlTag], i && i !== r.div && (o.markup = e.trim(o.markup)), o
        }

        function C(e, t) {
            function n(r, o, s) {
                var a, l, c, u;
                if (r && typeof r === Te && !r.nodeType && !r.markup && !r.getTgt) {
                    for (c in r) n(c, r[c], o);
                    return Y
                }
                return void 0 === o && (o = r, r = void 0), r && "" + r !== r && (s = o, o = r, r = void 0), u = s ? s[i] = s[i] || {} : n, l = t.compile, null === o ? r && delete u[r] : (o = l ? l(r, o, s, 0) : o, r && (u[r] = o)), l && o && (o._is = e), o && (a = te.onStore[e]) && a(r, o, l), o
            }
            var i = e + "s";
            Y[i] = n
        }

        function S(e, t, n, i, r, o) {
            var s, a, l, c, u, d, p, f, h = i,
                g = "";
            if (t === !0 ? (n = t, t = void 0) : typeof t !== Te && (t = void 0), (l = this.tag) ? (u = this, c = l._.tmpl || u.tmpl, h = h || u.view, arguments.length || (e = h)) : c = this, c) {
                if (!h && e && "view" === e._is && (h = e), h && e === h && (e = h.data), c.fn || (c = l._.tmpl = K[c] || K(c)), d = !h, ie = ie || d, h || ((t = t || {})
                        .root = e), !ie || ne.useViews || c.useViews || h && h !== J) g = A(c, e, t, n, h, r, o, l);
                else {
                    if (h ? (p = h.data, f = h.index, h.index = Ae) : (h = J, h.data = e, h.ctx = t), G(e) && !n)
                        for (s = 0, a = e.length; a > s; s++) h.index = s, h.data = e[s], g += c.fn(e[s], h, Y);
                    else g += c.fn(e, h, Y);
                    h.data = p, h.index = f
                }
                d && (ie = void 0)
            }
            return g
        }

        function A(e, t, n, i, r, o, s, a) {
            function l(e) {
                x = c({}, n), x[w] = e
            }
            var u, d, p, f, h, g, v, m, y, w, x, _, $ = "";
            if (a && (y = a.tagName, _ = a.tagCtx, n = n ? R(n, a.ctx) : a.ctx, v = _.content, _.props.link === !1 && (n = n || {}, n.link = !1), (w = _.props.itemVar) && ("~" !== w.charAt(0) && j("Use itemVar='~myItem'"), w = w.slice(1))), r && (v = v || r.content, s = s || r._.onRender, n = R(n, r.ctx)), o === !0 && (g = !0, o = 0), s && (n && n.link === !1 || a && a._.noVws) && (s = void 0), m = s, s === !0 && (m = void 0, s = r._.onRender), n = e.helpers ? R(e.helpers, n) : n, x = n, G(t) && !i)
                for (p = g ? r : void 0 !== o && r || new b(n, "array", r, t, e, o, v, s), w && (p.it = w), w = p.it, u = 0, d = t.length; d > u; u++) w && l(t[u]), f = new b(x, "item", p, t[u], e, (o || 0) + u, v, s), h = e.fn(t[u], f, Y), $ += p._.onRender ? p._.onRender(h, f) : h;
            else w && l(t), p = g ? r : new b(x, y || "data", r, t, e, o, v, s), a && !a.flow && (p.tag = a), $ += e.fn(t, p, Y);
            return m ? m($, p) : $
        }

        function E(e, t, n) {
            var i = ne.onError(e, t, n);
            if ("" + e === e) throw new te.Err(i);
            return !t.linkCtx && t.linked ? Q.html(i) : i
        }

        function j(e) {
            E("Syntax error\n" + e)
        }

        function O(e, t, n, i, r) {
            function o(t) {
                t -= f, t && g.push(e.substr(f, t)
                    .replace(pe, "\\n"))
            }

            function s(t, n) {
                t && (t += "}}", j((n ? "{{" + n + "}} block has {{/" + t + " without {{" + t : "Unmatched or missing {{/" + t) + ", in template:\n" + e))
            }

            function a(a, l, p, m, y, b, w, x, _, $, k, T) {
                b && (y = ":", m = ke), $ = $ || n && !r;
                var C = (l || n) && [
                        []
                    ],
                    S = "",
                    A = "",
                    E = "",
                    O = "",
                    D = "",
                    I = "",
                    L = "",
                    R = "",
                    q = !$ && !y && !w;
                p = p || (_ = _ || "#data", y), o(T), f = T + a.length, x ? d && g.push(["*", "\n" + _.replace(/^:/, "ret+= ")
                    .replace(fe, "$1") + ";\n"
                ]) : p ? ("else" === p && (ve.test(_) && j('for "{{else if expr}}" use "{{else expr}}"'), C = v[7] && [
                        []
                    ], v[8] = e.substring(v[8], T), v = h.pop(), g = v[2], q = !0), _ && P(_.replace(pe, " "), C, t)
                    .replace(ge, function (e, t, n, i, r, o, s, a) {
                        return i = "'" + r + "':", s ? (A += o + ",", O += "'" + a + "',") : n ? (E += i + o + ",", I += i + "'" + a + "',") : t ? L += o : ("trigger" === r && (R += o), S += i + o + ",", D += i + "'" + a + "',", u = u || we.test(r)), ""
                    })
                    .slice(0, -1), C && C[0] && C.pop(), c = [p, m || !!i || u || "", q && [], N(O, D, I), N(A, S, E), L, R, C || 0], g.push(c), q && (h.push(v), v = c, v[8] = f)) : k && (s(k !== v[0] && "else" !== v[0] && k, v[0]), v[8] = e.substring(v[8], T), v = h.pop()), s(!v && k), g = v[2]
            }
            var l, c, u, d = ne.allowCode || t && t.allowCode,
                p = [],
                f = 0,
                h = [],
                g = p,
                v = [, , p];
            return d && (t.allowCode = d), n && (e = oe + e + le), s(h[0] && h[0][2].pop()[0]), e.replace(B, a), o(e.length), (f = p[p.length - 1]) && s("" + f !== f && +f[8] === f[8] && f[0]), n ? (l = L(p, e, n), D(l, [p[0][7]])) : l = L(p, t), l
        }

        function D(e, t) {
            var n, i, r = 0,
                o = t.length;
            for (e.deps = []; o > r; r++) {
                i = t[r];
                for (n in i) "_jsvto" !== n && i[n].length && (e.deps = e.deps.concat(i[n]))
            }
            e.paths = i
        }

        function N(e, t, n) {
            return [e.slice(0, -1), t.slice(0, -1), n.slice(0, -1)]
        }

        function I(e, t) {
            return "\n	" + (t ? t + ":{" : "") + "args:[" + e[0] + "]" + (e[1] || !t ? ",\n	props:{" + e[1] + "}" : "") + (e[2] ? ",\n	ctx:{" + e[2] + "}" : "")
        }

        function P(e, t, n) {
            function i(i, m, y, b, w, x, _, $, k, T, C, S, A, E, D, N, I, P, L, R) {
                function q(e, n, i, s, a, l, d, p) {
                    var f = "." === i;
                    if (i && (w = w.slice(n.length), f || (e = (s ? 'view.hlp("' + s + '")' : a ? "view" : "data") + (p ? (l ? "." + l : s ? "" : a ? "" : "." + i) + (d || "") : (p = s ? "" : a ? l || "" : i, "")), e += p ? "." + p : "", e = n + ("view.data" === e.slice(0, 9) ? e.slice(5) : e)), c)) {
                        if (F = "linkTo" === r ? o = t._jsvto = t._jsvto || [] : u.bd, z = f && F[F.length - 1]) {
                            if (z._jsv) {
                                for (; z.sb;) z = z.sb;
                                z.bnd && (w = "^" + w.slice(1)), z.sb = w, z.bnd = z.bnd || "^" === w.charAt(0)
                            }
                        } else F.push(w);
                        v[h] = L + (f ? 1 : 0)
                    }
                    return e
                }
                b = c && b, b && !$ && (w = b + w), x = x || "", y = y || m || S, w = w || k, T = T || I || "";
                var M, H, F, z, U;
                if (!_ || l || a) {
                    if (c && N && !l && !a && (!r || s || o) && (M = v[h - 1], R.length - 1 > L - (M || 0))) {
                        if (M = R.slice(M, L + i.length), H !== !0)
                            if (F = o || d[h - 1].bd, z = F[F.length - 1], z && z.prm) {
                                for (; z.sb && z.sb.prm;) z = z.sb;
                                U = z.sb = {
                                    path: z.sb,
                                    bnd: z.bnd
                                }
                            } else F.push(U = {
                                path: F.pop()
                            });
                        N = se + ":" + M + " onerror=''" + ae, H = f[N], H || (f[N] = !0, f[N] = H = O(N, n, !0)), H !== !0 && U && (U._jsv = H, U.prm = u.bd, U.bnd = U.bnd || U.path && U.path.indexOf("^") >= 0)
                    }
                    return l ? (l = !A, l ? i : S + '"') : a ? (a = !E, a ? i : S + '"') : (y ? (v[h] = L++, u = d[++h] = {
                        bd: []
                    }, y) : "") + (P ? h ? "" : (p = R.slice(p, L), (r ? (r = s = o = !1, "\b") : "\b,") + p + (p = L + i.length, c && t.push(u.bd = []), "\b")) : $ ? (h && j(e), c && t.pop(), r = w, s = b, p = L + i.length, b && (c = u.bd = t[r] = []), w + ":") : w ? w.split("^")
                        .join(".")
                        .replace(ue, q) + (T ? (u = d[++h] = {
                            bd: []
                        }, g[h] = !0, T) : x) : x ? x : D ? (g[h] = !1, u = d[--h], D + (T ? (u = d[++h], g[h] = !0, T) : "")) : C ? (g[h] || j(e), ",") : m ? "" : (l = A, a = E, '"'))
                }
                j(e)
            }
            var r, o, s, a, l, c = t && t[0],
                u = {
                    bd: c
                },
                d = {
                    0: u
                },
                p = 0,
                f = n ? n.links : c && (c.links = c.links || {}),
                h = 0,
                g = {},
                v = {},
                m = (e + (n ? " " : ""))
                .replace(de, i);
            return !h && m || j(e)
        }

        function L(e, t, n) {
            var i, r, o, s, a, l, c, u, d, p, f, h, g, v, m, y, b, w, x, _, $, k, C, S, A, E, O, N, P, R, q = 0,
                M = ne.useViews || t.useViews || t.tags || t.templates || t.helpers || t.converters,
                H = "",
                F = {},
                z = e.length;
            for ("" + t === t ? (w = n ? 'data-link="' + t.replace(pe, " ")
                    .slice(1, -1) + '"' : t, t = 0) : (w = t.tmplName || "unnamed", t.allowCode && (F.allowCode = !0), t.debug && (F.debug = !0), f = t.bnds, b = t.tmpls), i = 0; z > i; i++)
                if (r = e[i], "" + r === r) H += '\n+"' + r + '"';
                else if (o = r[0], "*" === o) H += ";\n" + r[1] + "\nret=ret";
            else {
                if (s = r[1], $ = !n && r[2], a = I(r[3], "params") + "}," + I(g = r[4]), N = r[5], R = r[6], k = r[8] && r[8].replace(fe, "$1"), (A = "else" === o) ? h && h.push(r[7]) : (q = 0, f && (h = r[7]) && (h = [h], q = f.push(1))), M = M || g[1] || g[2] || h || /view.(?!index)/.test(g[0]), (E = ":" === o) ? s && (o = s === ke ? ">" : s + o) : ($ && (x = T(k, F), x.tmplName = w + "/" + o, x.useViews = x.useViews || M, L($, x), M = x.useViews, b.push(x)), A || (_ = o, M = M || o && (!ee[o] || !ee[o].flow), S = H, H = ""), C = e[i + 1], C = C && "else" === C[0]), P = N ? ";\ntry{\nret+=" : "\n+", v = "", m = "", E && (h || R || s && s !== ke)) {
                    if (O = "return {" + a + "};", y = 'c("' + s + '",view,', O = new Function("data,view,j,u", " // " + w + " " + q + " " + o + "\n" + O), O._er = N, v = y + q + ",", m = ")", O._tag = o, n) return O;
                    D(O, h), p = !0
                }
                if (H += E ? (n ? (N ? "\ntry{\n" : "") + "return " : P) + (p ? (p = void 0, M = d = !0, y + (h ? (f[q - 1] = O, q) : "{" + a + "}") + ")") : ">" === o ? (c = !0, "h(" + g[0] + ")") : (u = !0, "((v=" + (g[0] || "data") + ')!=null?v:"")')) : (l = !0, "\n{view:view,tmpl:" + ($ ? b.length : "0") + "," + a + "},"), _ && !C) {
                    if (H = "[" + H.slice(0, -1) + "]", y = 't("' + _ + '",view,this,', n || h) {
                        if (H = new Function("data,view,j,u", " // " + w + " " + q + " " + _ + "\nreturn " + H + ";"), H._er = N, H._tag = _, h && D(f[q - 1] = H, h), n) return H;
                        v = y + q + ",undefined,", m = ")"
                    }
                    H = S + P + y + (q || H) + ")", h = 0, _ = 0
                }
                N && (M = !0, H += ";\n}catch(e){ret" + (n ? "urn " : "+=") + v + "j._err(e,view," + N + ")" + m + ";}\n" + (n ? "" : "ret=ret"))
            }
            H = "// " + w + "\nvar v" + (l ? ",t=j._tag" : "") + (d ? ",c=j._cnvt" : "") + (c ? ",h=j.converters.html" : "") + (n ? ";\n" : ',ret=""\n') + (F.debug ? "debugger;" : "") + H + (n ? "\n" : ";\nreturn ret;"), ne._dbgMode && (H = "try {\n" + H + "\n}catch(e){\nreturn j._err(e, view);\n}");
            try {
                H = new Function("data,view,j,u", H)
            } catch (U) {
                j("Compiled template code:\n\n" + H + '\n: "' + U.message + '"')
            }
            return t && (t.fn = H, t.useViews = !!M), H
        }

        function R(e, t) {
            return e && e !== t ? t ? c(c({}, t), e) : e : t && c({}, t)
        }

        function q(e) {
            return $e[e] || ($e[e] = "&#" + e.charCodeAt(0) + ";")
        }

        function M(e) {
            var t, n, i = [];
            if (typeof e === Te)
                for (t in e) n = e[t], n && n.toJSON && !n.toJSON() || X(n) || i.push({
                    key: t,
                    prop: n
                });
            return i
        }

        function H(t, n, i) {
            var r = this.jquery && (this[0] || E('Unknown template: "' + this.selector + '"')),
                o = r.getAttribute(Ce);
            return S.call(o ? e.data(r)[Se] : K(r), t, n, i)
        }

        function F(e) {
            return void 0 != e ? be.test(e) && ("" + e)
                .replace(xe, q) || e : ""
        }
        var z = (0, eval)("this"),
            U = e === !1;
        e = e && e.fn ? e : z.jQuery;
        var W, B, V, J, Y, X, G, K, Q, Z, ee, te, ne, ie, re = "v1.0.0-beta",
            oe = "{",
            se = "{",
            ae = "}",
            le = "}",
            ce = "^",
            ue = /^(!*?)(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,
            de = /(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)(!*?[#~]?[\w$.^]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*:?\/]|(=))\s*|(!*?[#~]?[\w$.^]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*(([)\]])(?=\s*[.^]|\s*$|[^\(\[])|[)\]])([([]?))|(\s+)/g,
            pe = /[ \t]*(\r\n|\n|\r)/g,
            fe = /\\(['"])/g,
            he = /['"\\]/g,
            ge = /(?:\x08|^)(onerror:)?(?:(~?)(([\w$_\.]+):)?([^\x08]+))\x08(,)?([^\x08]+)/gi,
            ve = /^if\s/,
            me = /<(\w+)[>\s]/,
            ye = /[\x00`><"'&]/g,
            be = /[\x00`><\"'&]/,
            we = /^on[A-Z]|^convert(Back)?$/,
            xe = ye,
            _e = 0,
            $e = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\x00": "&#0;",
                "'": "&#39;",
                '"': "&#34;",
                "`": "&#96;"
            },
            ke = "html",
            Te = "object",
            Ce = "data-jsv-tmpl",
            Se = "jsvTmpl",
            Ae = "For #index in nested block use #getIndex().",
            Ee = {},
            je = z.jsrender,
            Oe = je && e && !e.render,
            De = {
                template: {
                    compile: $
                },
                tag: {
                    compile: x
                },
                helper: {},
                converter: {}
            };
        if (Y = {
                jsviews: re,
                settings: function (e) {
                    c(ne, e), a(ne._dbgMode), ne.jsv && ne.jsv()
                },
                sub: {
                    View: b,
                    Err: l,
                    tmplFn: O,
                    parse: P,
                    extend: c,
                    extendCtx: R,
                    syntaxErr: j,
                    onStore: {},
                    _ths: i,
                    _tg: function () {}
                },
                map: k,
                _cnvt: g,
                _tag: y,
                _err: E
            }, (l.prototype = new Error)
            .constructor = l, p.depends = function () {
                return [this.get("item"), "index"]
            }, f.depends = "index", b.prototype = {
                get: d,
                getIndex: f,
                getRsc: m,
                hlp: h,
                _is: "view"
            }, !(je || e && e.render)) {
            for (W in De) C(W, De[W]);
            K = Y.templates, Q = Y.converters, Z = Y.helpers, ee = Y.tags, te = Y.sub, ne = Y.settings, te._tg.prototype = {
                baseApply: _,
                cvtArgs: v
            }, J = te.topView = new b, e ? (e.fn.render = H, e.observable && (c(te, e.views.sub), Y.map = e.views.map)) : (e = {}, U && (z.jsrender = e), e.renderFile = e.__express = e.compile = function () {
                throw "Node.js: use npm jsrender, or jsrender-node.js"
            }, e.isFunction = function (e) {
                return "function" == typeof e
            }, e.isArray = Array.isArray || function (e) {
                return "[object Array]" === {}.toString.call(e)
            }, te._jq = function (t) {
                t !== e && (c(t, e), e = t, e.fn.render = H, delete e.jsrender)
            }, e.jsrender = re), X = e.isFunction, G = e.isArray, e.render = Ee, e.views = Y, e.templates = K = Y.templates, ne({
                debugMode: a,
                delimiters: u,
                onError: function (e, t, n) {
                    return t && (e = void 0 === n ? "{Error: " + (e.message || e) + "}" : X(n) ? n(e, t) : n), void 0 == e ? "" : e
                },
                _dbgMode: !1
            }), ee({
                "if": {
                    render: function (e) {
                        var t = this,
                            n = t.tagCtx,
                            i = t.rendering.done || !e && (arguments.length || !n.index) ? "" : (t.rendering.done = !0, t.selected = n.index, n.render(n.view, !0));
                        return i
                    },
                    flow: !0
                },
                "for": {
                    render: function (e) {
                        var t, n = !arguments.length,
                            i = this,
                            r = i.tagCtx,
                            o = "",
                            s = 0;
                        return i.rendering.done || (t = n ? r.view.data : e, void 0 !== t && (o += r.render(t, n), s += G(t) ? t.length : 1), (i.rendering.done = s) && (i.selected = r.index)), o
                    },
                    flow: !0
                },
                props: {
                    baseTag: "for",
                    dataMap: k(M),
                    flow: !0
                },
                include: {
                    flow: !0
                },
                "*": {
                    render: r,
                    flow: !0
                },
                ":*": {
                    render: r,
                    flow: !0
                },
                dbg: Z.dbg = Q.dbg = s
            }), Q({
                html: F,
                attr: F,
                url: function (e) {
                    return void 0 != e ? encodeURI("" + e) : null === e ? e : ""
                }
            }), u()
        }
        return Oe && je.views.sub._jq(e), e || je
    }),
    /*!
     * Markdown
     * Released under MIT license
     * Copyright (c) 2009-2010 Dominic Baggott
     * Copyright (c) 2009-2010 Ash Berlin
     * Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)
     * Version: 0.6.0-beta1
     * Date: 2014-07-28T16:38Z
     */
    function (e) {
        function t() {
            return "Markdown.mk_block( " + uneval(this.toString()) + ", " + uneval(this.trailing) + ", " + uneval(this.lineNumber) + " )"
        }

        function n() {
            var e = require("util");
            return "Markdown.mk_block( " + e.inspect(this.toString()) + ", " + e.inspect(this.trailing) + ", " + e.inspect(this.lineNumber) + " )"
        }

        function i(e) {
            return e.split("\n")
                .length - 1
        }

        function r(e) {
            return e && e.length > 0 ? e.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;") : ""
        }

        function o(e) {
            if ("string" == typeof e) return r(e);
            var t = e.shift(),
                n = {},
                i = [];
            for (!e.length || "object" != typeof e[0] || e[0] instanceof Array || (n = e.shift()); e.length;) i.push(o(e.shift()));
            var s = "";
            "undefined" != typeof n.src && (s += ' src="' + r(n.src) + '"', delete n.src);
            for (var a in n) {
                var l = r(n[a]);
                l && l.length && (s += " " + a + '="' + l + '"')
            }
            return "img" === t || "br" === t || "hr" === t ? "<" + t + s + "/>" : "<" + t + s + ">" + i.join("") + "</" + t + ">"
        }

        function s(e, t, n) {
            var i;
            n = n || {};
            var r = e.slice(0);
            "function" == typeof n.preprocessTreeNode && (r = n.preprocessTreeNode(r, t));
            var o = v(r);
            if (o) {
                r[1] = {};
                for (i in o) r[1][i] = o[i];
                o = r[1]
            }
            if ("string" == typeof r) return r;
            switch (r[0]) {
            case "header":
                r[0] = "h" + r[1].level, delete r[1].level;
                break;
            case "bulletlist":
                r[0] = "ul";
                break;
            case "numberlist":
                r[0] = "ol";
                break;
            case "listitem":
                r[0] = "li";
                break;
            case "para":
                r[0] = "p";
                break;
            case "markdown":
                r[0] = "html", o && delete o.references;
                break;
            case "code_block":
                r[0] = "pre", i = o ? 2 : 1;
                var a = ["code"];
                a.push.apply(a, r.splice(i, r.length - i)), r[i] = a;
                break;
            case "inlinecode":
                r[0] = "code";
                break;
            case "img":
                r[1].src = r[1].href, delete r[1].href;
                break;
            case "linebreak":
                r[0] = "br";
                break;
            case "link":
                r[0] = "a";
                break;
            case "link_ref":
                r[0] = "a";
                var l = t[o.ref];
                if (!l) return o.original;
                delete o.ref, o.href = l.href, l.title && (o.title = l.title), delete o.original;
                break;
            case "img_ref":
                r[0] = "img";
                var l = t[o.ref];
                if (!l) return o.original;
                delete o.ref, o.src = l.href, l.title && (o.title = l.title), delete o.original
            }
            if (i = 1, o) {
                for (var c in r[1]) {
                    i = 2;
                    break
                }
                1 === i && r.splice(i, 1)
            }
            for (; i < r.length; ++i) r[i] = s(r[i], t, n);
            return r
        }

        function a(e) {
            for (var t = v(e) ? 2 : 1; t < e.length;) "string" == typeof e[t] ? t + 1 < e.length && "string" == typeof e[t + 1] ? e[t] += e.splice(t + 1, 1)[0] : ++t : (a(e[t]), ++t)
        }

        function l(e, t) {
            function n(e) {
                this.len_after = e, this.name = "close_" + t
            }
            var i = e + "_state",
                r = "strong" === e ? "em_state" : "strong_state";
            return function (o) {
                if (this[i][0] === t) return this[i].shift(), [o.length, new n(o.length - t.length)];
                var s = this[r].slice(),
                    a = this[i].slice();
                this[i].unshift(t);
                var l = this.processInline(o.substr(t.length)),
                    c = l[l.length - 1];
                this[i].shift();
                if (c instanceof n) {
                    l.pop();
                    var u = o.length - c.len_after;
                    return [u, [e].concat(l)]
                }
                return this[r] = s, this[i] = a, [t.length, t]
            }
        }

        function c() {
            v(this.tree) || this.tree.splice(1, 0, {});
            var e = v(this.tree);
            return void 0 === e.references && (e.references = {}), e
        }

        function u(e, t) {
            t[2] && "<" === t[2][0] && ">" === t[2][t[2].length - 1] && (t[2] = t[2].substring(1, t[2].length - 1));
            var n = e.references[t[1].toLowerCase()] = {
                href: t[2]
            };
            void 0 !== t[4] ? n.title = t[4] : void 0 !== t[5] && (n.title = t[5])
        }

        function d(e) {
            for (var t = e.split(""), n = [""], i = !1; t.length;) {
                var r = t.shift();
                switch (r) {
                case " ":
                    i ? n[n.length - 1] += r : n.push("");
                    break;
                case "'":
                case '"':
                    i = !i;
                    break;
                case "\\":
                    r = t.shift();
                default:
                    n[n.length - 1] += r
                }
            }
            return n
        }
        var p = {};
        p.mk_block = function (e, i, r) {
            1 === arguments.length && (i = "\n\n");
            var o = new String(e);
            return o.trailing = i, o.inspect = n, o.toSource = t, void 0 !== r && (o.lineNumber = r), o
        };
        var f = p.isArray = Array.isArray || function (e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        };
        Array.prototype.forEach ? p.forEach = function (e, t, n) {
            return e.forEach(t, n)
        } : p.forEach = function (e, t, n) {
            for (var i = 0; i < e.length; i++) t.call(n || e, e[i], i, e)
        }, p.isEmpty = function (e) {
            for (var t in e)
                if (hasOwnProperty.call(e, t)) return !1;
            return !0
        }, p.extract_attr = function (e) {
            return f(e) && e.length > 1 && "object" == typeof e[1] && !f(e[1]) ? e[1] : void 0
        };
        var h = function (e) {
            switch (typeof e) {
            case "undefined":
                this.dialect = h.dialects.Gruber;
                break;
            case "object":
                this.dialect = e;
                break;
            default:
                if (!(e in h.dialects)) throw new Error("Unknown Markdown dialect '" + String(e) + "'");
                this.dialect = h.dialects[e]
            }
            this.em_state = [], this.strong_state = [], this.debug_indent = ""
        };
        h.dialects = {};
        var g = h.mk_block = p.mk_block,
            f = p.isArray;
        h.parse = function (e, t) {
            var n = new h(t);
            return n.toTree(e)
        }, h.prototype.split_blocks = function (e) {
            e = e.replace(/\r\n?/g, "\n");
            var t, n = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,
                r = [],
                o = 1;
            for (null !== (t = /^(\s*\n)/.exec(e)) && (o += i(t[0]), n.lastIndex = t[0].length); null !== (t = n.exec(e));) "\n#" === t[2] && (t[2] = "\n", n.lastIndex--), r.push(g(t[1], t[2], o)), o += i(t[0]);
            return r
        }, h.prototype.processBlock = function (e, t) {
            var n = this.dialect.block,
                i = n.__order__;
            if ("__call__" in n) return n.__call__.call(this, e, t);
            for (var r = 0; r < i.length; r++) {
                var o = n[i[r]].call(this, e, t);
                if (o) return (!f(o) || o.length > 0 && !f(o[0]) && "string" != typeof o[0]) && this.debug(i[r], "didn't return proper JsonML"), o
            }
            return []
        }, h.prototype.processInline = function (e) {
            return this.dialect.inline.__call__.call(this, String(e))
        }, h.prototype.toTree = function (e, t) {
            var n = e instanceof Array ? e : this.split_blocks(e),
                i = this.tree;
            try {
                for (this.tree = t || this.tree || ["markdown"]; n.length;) {
                    var r = this.processBlock(n.shift(), n);
                    r.length && this.tree.push.apply(this.tree, r)
                }
                return this.tree
            } finally {
                t && (this.tree = i)
            }
        }, h.prototype.debug = function () {
            var e = Array.prototype.slice.call(arguments);
            e.unshift(this.debug_indent), "undefined" != typeof print && print.apply(print, e), "undefined" != typeof console && "undefined" != typeof console.log && console.log.apply(null, e)
        }, h.prototype.loop_re_over_block = function (e, t, n) {
            for (var i, r = t.valueOf(); r.length && null !== (i = e.exec(r));) r = r.substr(i[0].length), n.call(this, i);
            return r
        }, h.buildBlockOrder = function (e) {
            var t = [];
            for (var n in e) "__order__" !== n && "__call__" !== n && t.push(n);
            e.__order__ = t
        }, h.buildInlinePatterns = function (e) {
            var t = [];
            for (var n in e)
                if (!n.match(/^__.*__$/)) {
                    var i = n.replace(/([\\.*+?^$|()\[\]{}])/g, "\\$1")
                        .replace(/\n/, "\\n");
                    t.push(1 === n.length ? i : "(?:" + i + ")")
                }
            t = t.join("|"), e.__patterns__ = t;
            var r = e.__call__;
            e.__call__ = function (e, n) {
                return void 0 !== n ? r.call(this, e, n) : r.call(this, e, t)
            }
        };
        var v = p.extract_attr;
        h.renderJsonML = function (e, t) {
            t = t || {}, t.root = t.root || !1;
            var n = [];
            if (t.root) n.push(o(e));
            else
                for (e.shift(), !e.length || "object" != typeof e[0] || e[0] instanceof Array || e.shift(); e.length;) n.push(o(e.shift()));
            return n.join("\n\n")
        }, h.toHTMLTree = function (e, t, n) {
            "string" == typeof e && (e = this.parse(e, t));
            var i = v(e),
                r = {};
            i && i.references && (r = i.references);
            var o = s(e, r, n);
            return a(o), o
        }, h.toHTML = function (e, t, n) {
            var i = this.toHTMLTree(e, t, n);
            return this.renderJsonML(i)
        };
        var m = {};
        m.inline_until_char = function (e, t) {
            for (var n = 0, i = [];;) {
                if (e.charAt(n) === t) return n++, [n, i];
                if (n >= e.length) return [n, null, i];
                var r = this.dialect.inline.__oneElement__.call(this, e.substr(n));
                n += r[0], i.push.apply(i, r.slice(1))
            }
        }, m.subclassDialect = function (e) {
            function t() {}

            function n() {}
            return t.prototype = e.block, n.prototype = e.inline, {
                block: new t,
                inline: new n
            }
        };
        var y = p.forEach,
            v = p.extract_attr,
            g = p.mk_block,
            b = p.isEmpty,
            w = m.inline_until_char,
            x = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/i.source,
            _ = {
                block: {
                    atxHeader: function (e, t) {
                        var n = e.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);
                        if (!n) return void 0;
                        var i = ["header", {
                            level: n[1].length
                        }];
                        return Array.prototype.push.apply(i, this.processInline(n[2])), n[0].length < e.length && t.unshift(g(e.substr(n[0].length), e.trailing, e.lineNumber + 2)), [i]
                    },
                    setextHeader: function (e, t) {
                        var n = e.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);
                        if (!n) return void 0;
                        var i = "=" === n[2] ? 1 : 2,
                            r = ["header", {
                                level: i
                            }].concat(this.processInline(n[1]));
                        return n[0].length < e.length && t.unshift(g(e.substr(n[0].length), e.trailing, e.lineNumber + 2)), [r]
                    },
                    code: function (e, t) {
                        var n = [],
                            i = /^(?: {0,3}\t| {4})(.*)\n?/;
                        if (!e.match(i)) return void 0;
                        e: for (;;) {
                            var r = this.loop_re_over_block(i, e.valueOf(), function (e) {
                                n.push(e[1])
                            });
                            if (r.length) {
                                t.unshift(g(r, e.trailing));
                                break e
                            }
                            if (!t.length) break e;
                            if (!t[0].match(i)) break e;
                            n.push(e.trailing.replace(/[^\n]/g, "")
                                .substring(2)), e = t.shift()
                        }
                        return [
                            ["code_block", n.join("\n")]
                        ]
                    },
                    horizRule: function (e, t) {
                        var n = e.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);
                        if (!n) return void 0;
                        var i = [
                            ["hr"]
                        ];
                        if (n[1]) {
                            var r = g(n[1], "", e.lineNumber);
                            i.unshift.apply(i, this.toTree(r, []))
                        }
                        return n[3] && t.unshift(g(n[3], e.trailing, e.lineNumber + 1)), i
                    },
                    lists: function () {
                        function e(e) {
                            return new RegExp("(?:^(" + l + "{0," + e + "} {0,3})(" + o + ")\\s+)|(^" + l + "{0," + (e - 1) + "}[ ]{0,4})")
                        }

                        function t(e) {
                            return e.replace(/ {0,3}\t/g, "    ")
                        }

                        function n(e, t, n, i) {
                            if (t) return void e.push(["para"].concat(n));
                            var r = e[e.length - 1] instanceof Array && "para" === e[e.length - 1][0] ? e[e.length - 1] : e;
                            i && e.length > 1 && n.unshift(i);
                            for (var o = 0; o < n.length; o++) {
                                var s = n[o],
                                    a = "string" == typeof s;
                                a && r.length > 1 && "string" == typeof r[r.length - 1] ? r[r.length - 1] += s : r.push(s)
                            }
                        }

                        function i(e, t) {
                            for (var n = new RegExp("^(" + l + "{" + e + "}.*?\\n?)*$"), i = new RegExp("^" + l + "{" + e + "}", "gm"), r = []; t.length > 0 && n.exec(t[0]);) {
                                var o = t.shift(),
                                    s = o.replace(i, "");
                                r.push(g(s, o.trailing, o.lineNumber))
                            }
                            return r
                        }

                        function r(e, t, n) {
                            var i = e.list,
                                r = i[i.length - 1];
                            if (!(r[1] instanceof Array && "para" === r[1][0]))
                                if (t + 1 === n.length) r.push(["para"].concat(r.splice(1, r.length - 1)));
                                else {
                                    var o = r.pop();
                                    r.push(["para"].concat(r.splice(1, r.length - 1)), o)
                                }
                        }
                        var o = "[*+-]|\\d+\\.",
                            s = /[*+-]/,
                            a = new RegExp("^( {0,3})(" + o + ")[ 	]+"),
                            l = "(?: {0,3}\\t| {4})";
                        return function (o, l) {
                            function c(e) {
                                var t = s.exec(e[2]) ? ["bulletlist"] : ["numberlist"];
                                return f.push({
                                    list: t,
                                    indent: e[1]
                                }), t
                            }
                            var u = o.match(a);
                            if (!u) return void 0;
                            for (var d, p, f = [], h = c(u), g = !1, v = [f[0].list];;) {
                                for (var m = o.split(/(?=\n)/), b = "", w = "", x = 0; x < m.length; x++) {
                                    w = "";
                                    var _ = m[x].replace(/^\n/, function (e) {
                                            return w = e, ""
                                        }),
                                        $ = e(f.length);
                                    if (u = _.match($), void 0 !== u[1]) {
                                        b.length && (n(d, g, this.processInline(b), w), g = !1, b = ""), u[1] = t(u[1]);
                                        var k = Math.floor(u[1].length / 4) + 1;
                                        if (k > f.length) h = c(u), d.push(h), d = h[1] = ["listitem"];
                                        else {
                                            var T = !1;
                                            for (p = 0; p < f.length; p++)
                                                if (f[p].indent === u[1]) {
                                                    h = f[p].list, f.splice(p + 1, f.length - (p + 1)), T = !0;
                                                    break
                                                }
                                            T || (k++, k <= f.length ? (f.splice(k, f.length - k), h = f[k - 1].list) : (h = c(u), d.push(h))), d = ["listitem"], h.push(d)
                                        }
                                        w = ""
                                    }
                                    _.length > u[0].length && (b += w + _.substr(u[0].length))
                                }
                                if (b.length) {
                                    var C = this.processBlock(b, []),
                                        S = C[0];
                                    S && (S.shift(), C.splice.apply(C, [0, 1].concat(S)), n(d, g, C, w), "\n" === d[d.length - 1] && d.pop(), g = !1, b = "")
                                }
                                var A = i(f.length, l);
                                A.length > 0 && (y(f, r, this), d.push.apply(d, this.toTree(A, [])));
                                var E = l[0] && l[0].valueOf() || "";
                                if (!E.match(a) && !E.match(/^ /)) break;
                                o = l.shift();
                                var j = this.dialect.block.horizRule.call(this, o, l);
                                if (j) {
                                    v.push.apply(v, j);
                                    break
                                }
                                f[f.length - 1].indent === o.match(/^\s*/)[0] && y(f, r, this), g = !0
                            }
                            return v
                        }
                    }(),
                    blockquote: function (e, t) {
                        var n = /(^|\n) +(\>[\s\S]*)/.exec(e);
                        if (n && n[2] && n[2].length) {
                            var i = e.replace(/(^|\n) +\>/, "$1>");
                            return t.unshift(i), []
                        }
                        if (!e.match(/^>/m)) return void 0;
                        var r = [];
                        if (">" !== e[0]) {
                            for (var o = e.split(/\n/), s = [], a = e.lineNumber; o.length && ">" !== o[0][0];) s.push(o.shift()), a++;
                            var l = g(s.join("\n"), "\n", e.lineNumber);
                            r.push.apply(r, this.processBlock(l, [])), e = g(o.join("\n"), e.trailing, a)
                        }
                        for (; t.length && ">" === t[0][0];) {
                            var c = t.shift();
                            e = g(e + e.trailing + c, c.trailing, e.lineNumber)
                        }
                        var u = e.replace(/^> ?/gm, ""),
                            d = (this.tree, this.toTree(u, ["blockquote"])),
                            p = v(d);
                        return p && p.references && (delete p.references, b(p) && d.splice(1, 1)), r.push(d), r
                    },
                    referenceDefn: function (e, t) {
                        var n = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*)\3|\((.*?)\)))?\n?/;
                        if (!e.match(n)) return void 0;
                        var i = c.call(this),
                            r = this.loop_re_over_block(n, e, function (e) {
                                u(i, e)
                            });
                        return r.length && t.unshift(g(r, e.trailing)), []
                    },
                    para: function (e) {
                        return [
                            ["para"].concat(this.processInline(e))
                        ]
                    }
                },
                inline: {
                    __oneElement__: function (e, t, n) {
                        var i, r;
                        t = t || this.dialect.inline.__patterns__;
                        var o = new RegExp("([\\s\\S]*?)(" + (t.source || t) + ")");
                        if (i = o.exec(e), !i) return [e.length, e];
                        if (i[1]) return [i[1].length, i[1]];
                        var r;
                        return i[2] in this.dialect.inline && (r = this.dialect.inline[i[2]].call(this, e.substr(i.index), i, n || [])), r = r || [i[2].length, i[2]]
                    },
                    __call__: function (e, t) {
                        function n(e) {
                            "string" == typeof e && "string" == typeof r[r.length - 1] ? r[r.length - 1] += e : r.push(e)
                        }
                        for (var i, r = []; e.length > 0;) i = this.dialect.inline.__oneElement__.call(this, e, t, r), e = e.substr(i.shift()), y(i, n);
                        return r
                    },
                    "]": function () {},
                    "}": function () {},
                    __escape__: /^\\[\\`\*_{}<>\[\]()#\+.!\-]/,
                    "\\": function (e) {
                        return this.dialect.inline.__escape__.exec(e) ? [2, e.charAt(1)] : [1, "\\"]
                    },
                    "![": function (e) {
                        if (!(e.indexOf("(") >= 0 && -1 === e.indexOf(")"))) {
                            var t = e.match(new RegExp("^!\\[(.*?)][ \\t]*\\((" + x + ")\\)([ \\t])*([\"'].*[\"'])?")) || e.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);
                            if (t) {
                                t[2] && "<" === t[2][0] && ">" === t[2][t[2].length - 1] && (t[2] = t[2].substring(1, t[2].length - 1)), t[2] = this.dialect.inline.__call__.call(this, t[2], /\\/)[0];
                                var n = {
                                    alt: t[1],
                                    href: t[2] || ""
                                };
                                return void 0 !== t[4] && (n.title = t[4]), [t[0].length, ["img", n]]
                            }
                            return t = e.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/), t ? [t[0].length, ["img_ref", {
                                alt: t[1],
                                ref: t[2].toLowerCase(),
                                original: t[0]
                            }]] : [2, "!["]
                        }
                    },
                    "[": function k(e) {
                        for (var t = 1, n = 0; n < e.length; n++) {
                            var i = e.charAt(n);
                            if ("[" === i && t++, "]" === i && t--, t > 3) return [1, "["]
                        }
                        var r = String(e),
                            o = w.call(this, e.substr(1), "]");
                        if (!o[1]) return [o[0] + 1, e.charAt(0)].concat(o[2]);
                        var k, s, a = 1 + o[0],
                            l = o[1];
                        e = e.substr(a);
                        var d = e.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);
                        if (d) {
                            var p = d[1].replace(/\s+$/, "");
                            if (a += d[0].length, p && "<" === p[0] && ">" === p[p.length - 1] && (p = p.substring(1, p.length - 1)), !d[3])
                                for (var f = 1, h = 0; h < p.length; h++) switch (p[h]) {
                                case "(":
                                    f++;
                                    break;
                                case ")":
                                    0 === --f && (a -= p.length - h, p = p.substring(0, h))
                                }
                            return p = this.dialect.inline.__call__.call(this, p, /\\/)[0], s = {
                                href: p || ""
                            }, void 0 !== d[3] && (s.title = d[3]), k = ["link", s].concat(l), [a, k]
                        }
                        if (d = e.match(new RegExp("^\\((" + x + ")\\)")), d && d[1]) return a += d[0].length, k = ["link", {
                            href: d[1]
                        }].concat(l), [a, k];
                        if (d = e.match(/^\s*\[(.*?)\]/), d && (a += d[0].length, s = {
                                ref: (d[1] || String(l))
                                    .toLowerCase(),
                                original: r.substr(0, a)
                            }, l && l.length > 0)) return k = ["link_ref", s].concat(l), [a, k];
                        if (d = r.match(/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/)) {
                            var s = c.call(this);
                            return u(s, d), [d[0].length]
                        }
                        if (1 === l.length && "string" == typeof l[0]) {
                            var g = l[0].toLowerCase()
                                .replace(/\s+/, " ");
                            return s = {
                                ref: g,
                                original: r.substr(0, a)
                            }, k = ["link_ref", s, l[0]], [a, k]
                        }
                        return [1, "["]
                    },
                    "<": function (e) {
                        var t;
                        return null !== (t = e.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/)) ? t[3] ? [t[0].length, ["link", {
                            href: "mailto:" + t[3]
                        }, t[3]]] : "mailto" === t[2] ? [t[0].length, ["link", {
                            href: t[1]
                        }, t[1].substr("mailto:".length)]] : [t[0].length, ["link", {
                            href: t[1]
                        }, t[1]]] : [1, "<"]
                    },
                    "`": function (e) {
                        var t = e.match(/(`+)(([\s\S]*?)\1)/);
                        return t && t[2] ? [t[1].length + t[2].length, ["inlinecode", t[3]]] : [1, "`"]
                    },
                    "  \n": function () {
                        return [3, ["linebreak"]]
                    }
                }
            };
        _.inline["**"] = l("strong", "**"), _.inline.__ = l("strong", "__"), _.inline["*"] = l("em", "*"), _.inline._ = l("em", "_"), h.dialects.Gruber = _, h.buildBlockOrder(h.dialects.Gruber.block), h.buildInlinePatterns(h.dialects.Gruber.inline);
        var $ = m.subclassDialect(_),
            v = p.extract_attr,
            y = p.forEach;
        $.processMetaHash = function (e) {
            for (var t = d(e), n = {}, i = 0; i < t.length; ++i)
                if (/^#/.test(t[i])) n.id = t[i].substring(1);
                else if (/^\./.test(t[i])) n["class"] ? n["class"] = n["class"] + t[i].replace(/./, " ") : n["class"] = t[i].substring(1);
            else if (/\=/.test(t[i])) {
                var r = t[i].split(/\=/);
                n[r[0]] = r[1]
            }
            return n
        }, $.block.document_meta = function (e) {
            if (e.lineNumber > 1) return void 0;
            if (!e.match(/^(?:\w+:.*\n)*\w+:.*$/)) return void 0;
            v(this.tree) || this.tree.splice(1, 0, {});
            var t = e.split(/\n/);
            for (var n in t) {
                var i = t[n].match(/(\w+):\s*(.*)$/),
                    r = i[1].toLowerCase(),
                    o = i[2];
                this.tree[1][r] = o
            }
            return []
        }, $.block.block_meta = function (e) {
            var t = e.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);
            if (!t) return void 0;
            var n, i = this.dialect.processMetaHash(t[2]);
            if ("" === t[1]) {
                var r = this.tree[this.tree.length - 1];
                if (n = v(r), "string" == typeof r) return void 0;
                n || (n = {}, r.splice(1, 0, n));
                for (var o in i) n[o] = i[o];
                return []
            }
            var s = e.replace(/\n.*$/, ""),
                a = this.processBlock(s, []);
            n = v(a[0]), n || (n = {}, a[0].splice(1, 0, n));
            for (var o in i) n[o] = i[o];
            return a
        }, $.block.definition_list = function (e, t) {
            var n, i, r = /^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,
                o = ["dl"];
            if (!(i = e.match(r))) return void 0;
            for (var s = [e]; t.length && r.exec(t[0]);) s.push(t.shift());
            for (var a = 0; a < s.length; ++a) {
                var i = s[a].match(r),
                    l = i[1].replace(/\n$/, "")
                    .split(/\n/),
                    c = i[2].split(/\n:\s+/);
                for (n = 0; n < l.length; ++n) o.push(["dt", l[n]]);
                for (n = 0; n < c.length; ++n) o.push(["dd"].concat(this.processInline(c[n].replace(/(\n)\s+/, "$1"))))
            }
            return [o]
        }, $.block.table = function T(e) {
            var t, n, i = function (e, t) {
                    t = t || "\\s", t.match(/^[\\|\[\]{}?*.+^$]$/) && (t = "\\" + t);
                    for (var n, i = [], r = new RegExp("^((?:\\\\.|[^\\\\" + t + "])*)" + t + "(.*)"); n = e.match(r);) i.push(n[1]), e = n[2];
                    return i.push(e), i
                },
                r = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
                o = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/;
            if (n = e.match(r)) n[3] = n[3].replace(/^\s*\|/gm, "");
            else if (!(n = e.match(o))) return void 0;
            var T = ["table", ["thead", ["tr"]],
                ["tbody"]
            ];
            n[2] = n[2].replace(/\|\s*$/, "")
                .split("|");
            var s = [];
            for (y(n[2], function (e) {
                    e.match(/^\s*-+:\s*$/) ? s.push({
                        align: "right"
                    }) : e.match(/^\s*:-+\s*$/) ? s.push({
                        align: "left"
                    }) : e.match(/^\s*:-+:\s*$/) ? s.push({
                        align: "center"
                    }) : s.push({})
                }), n[1] = i(n[1].replace(/\|\s*$/, ""), "|"), t = 0; t < n[1].length; t++) T[1][1].push(["th", s[t] || {}].concat(this.processInline(n[1][t].trim())));
            return y(n[3].replace(/\|\s*$/gm, "")
                .split("\n"),
                function (e) {
                    var n = ["tr"];
                    for (e = i(e, "|"), t = 0; t < e.length; t++) n.push(["td", s[t] || {}].concat(this.processInline(e[t].trim())));
                    T[2].push(n)
                }, this), [T]
        }, $.inline["{:"] = function (e, t, n) {
            if (!n.length) return [2, "{:"];
            var i = n[n.length - 1];
            if ("string" == typeof i) return [2, "{:"];
            var r = e.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);
            if (!r) return [2, "{:"];
            var o = this.dialect.processMetaHash(r[1]),
                s = v(i);
            s || (s = {}, i.splice(1, 0, s));
            for (var a in o) s[a] = o[a];
            return [r[0].length, ""]
        }, h.dialects.Maruku = $, h.dialects.Maruku.inline.__escape__ = /^\\[\\`\*_{}\[\]()#\+.!\-|:]/, h.buildBlockOrder(h.dialects.Maruku.block), h.buildInlinePatterns(h.dialects.Maruku.inline), e.Markdown = h, e.parse = h.parse, e.toHTML = h.toHTML, e.toHTMLTree = h.toHTMLTree, e.renderJsonML = h.renderJsonML, e.DialectHelpers = m
    }(function () {
        return window.markdown = {}, window.markdown
    }()),
    /* ========================================================================
     * Bootstrap: affix.js v3.3.5
     * http://getbootstrap.com/javascript/#affix
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            return this.each(function () {
                var i = e(this),
                    r = i.data("bs.affix"),
                    o = "object" == typeof t && t;
                r || i.data("bs.affix", r = new n(this, o)), "string" == typeof t && r[t]()
            })
        }
        var n = function (t, i) {
            this.options = e.extend({}, n.DEFAULTS, i), this.$target = e(this.options.target)
                .on("scroll.bs.affix.data-api", e.proxy(this.checkPosition, this))
                .on("click.bs.affix.data-api", e.proxy(this.checkPositionWithEventLoop, this)), this.$element = e(t), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
        };
        n.VERSION = "3.3.5", n.RESET = "affix affix-top affix-bottom", n.DEFAULTS = {
            offset: 0,
            target: window
        }, n.prototype.getState = function (e, t, n, i) {
            var r = this.$target.scrollTop(),
                o = this.$element.offset(),
                s = this.$target.height();
            if (null != n && "top" == this.affixed) return n > r ? "top" : !1;
            if ("bottom" == this.affixed) return null != n ? r + this.unpin <= o.top ? !1 : "bottom" : e - i >= r + s ? !1 : "bottom";
            var a = null == this.affixed,
                l = a ? r : o.top,
                c = a ? s : t;
            return null != n && n >= r ? "top" : null != i && l + c >= e - i ? "bottom" : !1
        }, n.prototype.getPinnedOffset = function () {
            if (this.pinnedOffset) return this.pinnedOffset;
            this.$element.removeClass(n.RESET)
                .addClass("affix");
            var e = this.$target.scrollTop(),
                t = this.$element.offset();
            return this.pinnedOffset = t.top - e
        }, n.prototype.checkPositionWithEventLoop = function () {
            setTimeout(e.proxy(this.checkPosition, this), 1)
        }, n.prototype.checkPosition = function () {
            if (this.$element.is(":visible")) {
                var t = this.$element.height(),
                    i = this.options.offset,
                    r = i.top,
                    o = i.bottom,
                    s = Math.max(e(document)
                        .height(), e(document.body)
                        .height());
                "object" != typeof i && (o = r = i), "function" == typeof r && (r = i.top(this.$element)), "function" == typeof o && (o = i.bottom(this.$element));
                var a = this.getState(s, t, r, o);
                if (this.affixed != a) {
                    null != this.unpin && this.$element.css("top", "");
                    var l = "affix" + (a ? "-" + a : ""),
                        c = e.Event(l + ".bs.affix");
                    if (this.$element.trigger(c), c.isDefaultPrevented()) return;
                    this.affixed = a, this.unpin = "bottom" == a ? this.getPinnedOffset() : null, this.$element.removeClass(n.RESET)
                        .addClass(l)
                        .trigger(l.replace("affix", "affixed") + ".bs.affix")
                }
                "bottom" == a && this.$element.offset({
                    top: s - t - o
                })
            }
        };
        var i = e.fn.affix;
        e.fn.affix = t, e.fn.affix.Constructor = n, e.fn.affix.noConflict = function () {
                return e.fn.affix = i, this
            }, e(window)
            .on("load", function () {
                e('[data-spy="affix"]')
                    .each(function () {
                        var n = e(this),
                            i = n.data();
                        i.offset = i.offset || {}, null != i.offsetBottom && (i.offset.bottom = i.offsetBottom), null != i.offsetTop && (i.offset.top = i.offsetTop), t.call(n, i)
                    })
            })
    }(jQuery),
    /* ========================================================================
     * Bootstrap: alert.js v3.3.5
     * http://getbootstrap.com/javascript/#alerts
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            return this.each(function () {
                var n = e(this),
                    r = n.data("bs.alert");
                r || n.data("bs.alert", r = new i(this)), "string" == typeof t && r[t].call(n)
            })
        }
        var n = '[data-dismiss="alert"]',
            i = function (t) {
                e(t)
                    .on("click", n, this.close)
            };
        i.VERSION = "3.3.5", i.TRANSITION_DURATION = 150, i.prototype.close = function (t) {
            function n() {
                s.detach()
                    .trigger("closed.bs.alert")
                    .remove()
            }
            var r = e(this),
                o = r.attr("data-target");
            o || (o = r.attr("href"), o = o && o.replace(/.*(?=#[^\s]*$)/, ""));
            var s = e(o);
            t && t.preventDefault(), s.length || (s = r.closest(".alert")), s.trigger(t = e.Event("close.bs.alert")), t.isDefaultPrevented() || (s.removeClass("in"), e.support.transition && s.hasClass("fade") ? s.one("bsTransitionEnd", n)
                .emulateTransitionEnd(i.TRANSITION_DURATION) : n())
        };
        var r = e.fn.alert;
        e.fn.alert = t, e.fn.alert.Constructor = i, e.fn.alert.noConflict = function () {
                return e.fn.alert = r, this
            }, e(document)
            .on("click.bs.alert.data-api", n, i.prototype.close)
    }(jQuery),
    /* ========================================================================
     * Bootstrap: button.js v3.3.5
     * http://getbootstrap.com/javascript/#buttons
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            return this.each(function () {
                var i = e(this),
                    r = i.data("bs.button"),
                    o = "object" == typeof t && t;
                r || i.data("bs.button", r = new n(this, o)), "toggle" == t ? r.toggle() : t && r.setState(t)
            })
        }
        var n = function (t, i) {
            this.$element = e(t), this.options = e.extend({}, n.DEFAULTS, i), this.isLoading = !1
        };
        n.VERSION = "3.3.5", n.DEFAULTS = {
            loadingText: "loading..."
        }, n.prototype.setState = function (t) {
            var n = "disabled",
                i = this.$element,
                r = i.is("input") ? "val" : "html",
                o = i.data();
            t += "Text", null == o.resetText && i.data("resetText", i[r]()), setTimeout(e.proxy(function () {
                i[r](null == o[t] ? this.options[t] : o[t]), "loadingText" == t ? (this.isLoading = !0, i.addClass(n)
                    .attr(n, n)) : this.isLoading && (this.isLoading = !1, i.removeClass(n)
                    .removeAttr(n))
            }, this), 0)
        }, n.prototype.toggle = function () {
            var e = !0,
                t = this.$element.closest('[data-toggle="buttons"]');
            if (t.length) {
                var n = this.$element.find("input");
                "radio" == n.prop("type") ? (n.prop("checked") && (e = !1), t.find(".active")
                    .removeClass("active"), this.$element.addClass("active")) : "checkbox" == n.prop("type") && (n.prop("checked") !== this.$element.hasClass("active") && (e = !1), this.$element.toggleClass("active")), n.prop("checked", this.$element.hasClass("active")), e && n.trigger("change")
            } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
        };
        var i = e.fn.button;
        e.fn.button = t, e.fn.button.Constructor = n, e.fn.button.noConflict = function () {
                return e.fn.button = i, this
            }, e(document)
            .on("click.bs.button.data-api", '[data-toggle^="button"]', function (n) {
                var i = e(n.target);
                i.hasClass("btn") || (i = i.closest(".btn")), t.call(i, "toggle"), e(n.target)
                    .is('input[type="radio"]') || e(n.target)
                    .is('input[type="checkbox"]') || n.preventDefault()
            })
            .on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (t) {
                e(t.target)
                    .closest(".btn")
                    .toggleClass("focus", /^focus(in)?$/.test(t.type))
            })
    }(jQuery),
    /* ========================================================================
     * Bootstrap: carousel.js v3.3.5
     * http://getbootstrap.com/javascript/#carousel
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            return this.each(function () {
                var i = e(this),
                    r = i.data("bs.carousel"),
                    o = e.extend({}, n.DEFAULTS, i.data(), "object" == typeof t && t),
                    s = "string" == typeof t ? t : o.slide;
                r || i.data("bs.carousel", r = new n(this, o)), "number" == typeof t ? r.to(t) : s ? r[s]() : o.interval && r.pause()
                    .cycle()
            })
        }
        var n = function (t, n) {
            this.$element = e(t), this.$indicators = this.$element.find(".carousel-indicators"), this.options = n, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", e.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", e.proxy(this.pause, this))
                .on("mouseleave.bs.carousel", e.proxy(this.cycle, this))
        };
        n.VERSION = "3.3.5", n.TRANSITION_DURATION = 600, n.DEFAULTS = {
            interval: 5e3,
            pause: "hover",
            wrap: !0,
            keyboard: !0
        }, n.prototype.keydown = function (e) {
            if (!/input|textarea/i.test(e.target.tagName)) {
                switch (e.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
                }
                e.preventDefault()
            }
        }, n.prototype.cycle = function (t) {
            return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(e.proxy(this.next, this), this.options.interval)), this
        }, n.prototype.getItemIndex = function (e) {
            return this.$items = e.parent()
                .children(".item"), this.$items.index(e || this.$active)
        }, n.prototype.getItemForDirection = function (e, t) {
            var n = this.getItemIndex(t),
                i = "prev" == e && 0 === n || "next" == e && n == this.$items.length - 1;
            if (i && !this.options.wrap) return t;
            var r = "prev" == e ? -1 : 1,
                o = (n + r) % this.$items.length;
            return this.$items.eq(o)
        }, n.prototype.to = function (e) {
            var t = this,
                n = this.getItemIndex(this.$active = this.$element.find(".item.active"));
            return e > this.$items.length - 1 || 0 > e ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
                    t.to(e)
                }) : n == e ? this.pause()
                .cycle() : this.slide(e > n ? "next" : "prev", this.$items.eq(e))
        }, n.prototype.pause = function (t) {
            return t || (this.paused = !0), this.$element.find(".next, .prev")
                .length && e.support.transition && (this.$element.trigger(e.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
        }, n.prototype.next = function () {
            return this.sliding ? void 0 : this.slide("next")
        }, n.prototype.prev = function () {
            return this.sliding ? void 0 : this.slide("prev")
        }, n.prototype.slide = function (t, i) {
            var r = this.$element.find(".item.active"),
                o = i || this.getItemForDirection(t, r),
                s = this.interval,
                a = "next" == t ? "left" : "right",
                l = this;
            if (o.hasClass("active")) return this.sliding = !1;
            var c = o[0],
                u = e.Event("slide.bs.carousel", {
                    relatedTarget: c,
                    direction: a
                });
            if (this.$element.trigger(u), !u.isDefaultPrevented()) {
                if (this.sliding = !0, s && this.pause(), this.$indicators.length) {
                    this.$indicators.find(".active")
                        .removeClass("active");
                    var d = e(this.$indicators.children()[this.getItemIndex(o)]);
                    d && d.addClass("active")
                }
                var p = e.Event("slid.bs.carousel", {
                    relatedTarget: c,
                    direction: a
                });
                return e.support.transition && this.$element.hasClass("slide") ? (o.addClass(t), o[0].offsetWidth, r.addClass(a), o.addClass(a), r.one("bsTransitionEnd", function () {
                        o.removeClass([t, a].join(" "))
                            .addClass("active"), r.removeClass(["active", a].join(" ")), l.sliding = !1, setTimeout(function () {
                                l.$element.trigger(p)
                            }, 0)
                    })
                    .emulateTransitionEnd(n.TRANSITION_DURATION)) : (r.removeClass("active"), o.addClass("active"), this.sliding = !1, this.$element.trigger(p)), s && this.cycle(), this
            }
        };
        var i = e.fn.carousel;
        e.fn.carousel = t, e.fn.carousel.Constructor = n, e.fn.carousel.noConflict = function () {
            return e.fn.carousel = i, this
        };
        var r = function (n) {
            var i, r = e(this),
                o = e(r.attr("data-target") || (i = r.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, ""));
            if (o.hasClass("carousel")) {
                var s = e.extend({}, o.data(), r.data()),
                    a = r.attr("data-slide-to");
                a && (s.interval = !1), t.call(o, s), a && o.data("bs.carousel")
                    .to(a), n.preventDefault()
            }
        };
        e(document)
            .on("click.bs.carousel.data-api", "[data-slide]", r)
            .on("click.bs.carousel.data-api", "[data-slide-to]", r), e(window)
            .on("load", function () {
                e('[data-ride="carousel"]')
                    .each(function () {
                        var n = e(this);
                        t.call(n, n.data())
                    })
            })
    }(jQuery),
    /* ========================================================================
     * Bootstrap: collapse.js v3.3.5
     * http://getbootstrap.com/javascript/#collapse
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            var n, i = t.attr("data-target") || (n = t.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "");
            return e(i)
        }

        function n(t) {
            return this.each(function () {
                var n = e(this),
                    r = n.data("bs.collapse"),
                    o = e.extend({}, i.DEFAULTS, n.data(), "object" == typeof t && t);
                !r && o.toggle && /show|hide/.test(t) && (o.toggle = !1), r || n.data("bs.collapse", r = new i(this, o)), "string" == typeof t && r[t]()
            })
        }
        var i = function (t, n) {
            this.$element = e(t), this.options = e.extend({}, i.DEFAULTS, n), this.$trigger = e('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
        };
        i.VERSION = "3.3.5", i.TRANSITION_DURATION = 350, i.DEFAULTS = {
            toggle: !0
        }, i.prototype.dimension = function () {
            var e = this.$element.hasClass("width");
            return e ? "width" : "height"
        }, i.prototype.show = function () {
            if (!this.transitioning && !this.$element.hasClass("in")) {
                var t, r = this.$parent && this.$parent.children(".panel")
                    .children(".in, .collapsing");
                if (!(r && r.length && (t = r.data("bs.collapse"), t && t.transitioning))) {
                    var o = e.Event("show.bs.collapse");
                    if (this.$element.trigger(o), !o.isDefaultPrevented()) {
                        r && r.length && (n.call(r, "hide"), t || r.data("bs.collapse", null));
                        var s = this.dimension();
                        this.$element.removeClass("collapse")
                            .addClass("collapsing")[s](0)
                            .attr("aria-expanded", !0), this.$trigger.removeClass("collapsed")
                            .attr("aria-expanded", !0), this.transitioning = 1;
                        var a = function () {
                            this.$element.removeClass("collapsing")
                                .addClass("collapse in")[s](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                        };
                        if (!e.support.transition) return a.call(this);
                        var l = e.camelCase(["scroll", s].join("-"));
                        this.$element.one("bsTransitionEnd", e.proxy(a, this))
                            .emulateTransitionEnd(i.TRANSITION_DURATION)[s](this.$element[0][l])
                    }
                }
            }
        }, i.prototype.hide = function () {
            if (!this.transitioning && this.$element.hasClass("in")) {
                var t = e.Event("hide.bs.collapse");
                if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                    var n = this.dimension();
                    this.$element[n](this.$element[n]())[0].offsetHeight, this.$element.addClass("collapsing")
                        .removeClass("collapse in")
                        .attr("aria-expanded", !1), this.$trigger.addClass("collapsed")
                        .attr("aria-expanded", !1), this.transitioning = 1;
                    var r = function () {
                        this.transitioning = 0, this.$element.removeClass("collapsing")
                            .addClass("collapse")
                            .trigger("hidden.bs.collapse")
                    };
                    return e.support.transition ? void this.$element[n](0)
                        .one("bsTransitionEnd", e.proxy(r, this))
                        .emulateTransitionEnd(i.TRANSITION_DURATION) : r.call(this)
                }
            }
        }, i.prototype.toggle = function () {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }, i.prototype.getParent = function () {
            return e(this.options.parent)
                .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
                .each(e.proxy(function (n, i) {
                    var r = e(i);
                    this.addAriaAndCollapsedClass(t(r), r)
                }, this))
                .end()
        }, i.prototype.addAriaAndCollapsedClass = function (e, t) {
            var n = e.hasClass("in");
            e.attr("aria-expanded", n), t.toggleClass("collapsed", !n)
                .attr("aria-expanded", n)
        };
        var r = e.fn.collapse;
        e.fn.collapse = n, e.fn.collapse.Constructor = i, e.fn.collapse.noConflict = function () {
                return e.fn.collapse = r, this
            }, e(document)
            .on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (i) {
                var r = e(this);
                r.attr("data-target") || i.preventDefault();
                var o = t(r),
                    s = o.data("bs.collapse"),
                    a = s ? "toggle" : r.data();
                n.call(o, a)
            })
    }(jQuery),
    /* ========================================================================
     * Bootstrap: dropdown.js v3.3.5
     * http://getbootstrap.com/javascript/#dropdowns
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            var n = t.attr("data-target");
            n || (n = t.attr("href"), n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
            var i = n && e(n);
            return i && i.length ? i : t.parent()
        }

        function n(n) {
            n && 3 === n.which || (e(r)
                .remove(), e(o)
                .each(function () {
                    var i = e(this),
                        r = t(i),
                        o = {
                            relatedTarget: this
                        };
                    r.hasClass("open") && (n && "click" == n.type && /input|textarea/i.test(n.target.tagName) && e.contains(r[0], n.target) || (r.trigger(n = e.Event("hide.bs.dropdown", o)), n.isDefaultPrevented() || (i.attr("aria-expanded", "false"), r.removeClass("open")
                        .trigger("hidden.bs.dropdown", o))))
                }))
        }

        function i(t) {
            return this.each(function () {
                var n = e(this),
                    i = n.data("bs.dropdown");
                i || n.data("bs.dropdown", i = new s(this)), "string" == typeof t && i[t].call(n)
            })
        }
        var r = ".dropdown-backdrop",
            o = '[data-toggle="dropdown"]',
            s = function (t) {
                e(t)
                    .on("click.bs.dropdown", this.toggle)
            };
        s.VERSION = "3.3.5", s.prototype.toggle = function (i) {
            var r = e(this);
            if (!r.is(".disabled, :disabled")) {
                var o = t(r),
                    s = o.hasClass("open");
                if (n(), !s) {
                    "ontouchstart" in document.documentElement && !o.closest(".navbar-nav")
                        .length && e(document.createElement("div"))
                        .addClass("dropdown-backdrop")
                        .insertAfter(e(this))
                        .on("click", n);
                    var a = {
                        relatedTarget: this
                    };
                    if (o.trigger(i = e.Event("show.bs.dropdown", a)), i.isDefaultPrevented()) return;
                    r.trigger("focus")
                        .attr("aria-expanded", "true"), o.toggleClass("open")
                        .trigger("shown.bs.dropdown", a)
                }
                return !1
            }
        }, s.prototype.keydown = function (n) {
            if (/(38|40|27|32)/.test(n.which) && !/input|textarea/i.test(n.target.tagName)) {
                var i = e(this);
                if (n.preventDefault(), n.stopPropagation(), !i.is(".disabled, :disabled")) {
                    var r = t(i),
                        s = r.hasClass("open");
                    if (!s && 27 != n.which || s && 27 == n.which) return 27 == n.which && r.find(o)
                        .trigger("focus"), i.trigger("click");
                    var a = " li:not(.disabled):visible a",
                        l = r.find(".dropdown-menu" + a);
                    if (l.length) {
                        var c = l.index(n.target);
                        38 == n.which && c > 0 && c--, 40 == n.which && c < l.length - 1 && c++, ~c || (c = 0), l.eq(c)
                            .trigger("focus")
                    }
                }
            }
        };
        var a = e.fn.dropdown;
        e.fn.dropdown = i, e.fn.dropdown.Constructor = s, e.fn.dropdown.noConflict = function () {
                return e.fn.dropdown = a, this
            }, e(document)
            .on("click.bs.dropdown.data-api", n)
            .on("click.bs.dropdown.data-api", ".dropdown form", function (e) {
                e.stopPropagation()
            })
            .on("click.bs.dropdown.data-api", o, s.prototype.toggle)
            .on("keydown.bs.dropdown.data-api", o, s.prototype.keydown)
            .on("keydown.bs.dropdown.data-api", ".dropdown-menu", s.prototype.keydown)
    }(jQuery),
    /* ========================================================================
     * Bootstrap: tab.js v3.3.5
     * http://getbootstrap.com/javascript/#tabs
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            return this.each(function () {
                var i = e(this),
                    r = i.data("bs.tab");
                r || i.data("bs.tab", r = new n(this)), "string" == typeof t && r[t]()
            })
        }
        var n = function (t) {
            this.element = e(t)
        };
        n.VERSION = "3.3.5", n.TRANSITION_DURATION = 150, n.prototype.show = function () {
            var t = this.element,
                n = t.closest("ul:not(.dropdown-menu)"),
                i = t.data("target");
            if (i || (i = t.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li")
                .hasClass("active")) {
                var r = n.find(".active:last a"),
                    o = e.Event("hide.bs.tab", {
                        relatedTarget: t[0]
                    }),
                    s = e.Event("show.bs.tab", {
                        relatedTarget: r[0]
                    });
                if (r.trigger(o), t.trigger(s), !s.isDefaultPrevented() && !o.isDefaultPrevented()) {
                    var a = e(i);
                    this.activate(t.closest("li"), n), this.activate(a, a.parent(), function () {
                        r.trigger({
                            type: "hidden.bs.tab",
                            relatedTarget: t[0]
                        }), t.trigger({
                            type: "shown.bs.tab",
                            relatedTarget: r[0]
                        })
                    })
                }
            }
        }, n.prototype.activate = function (t, i, r) {
            function o() {
                s.removeClass("active")
                    .find("> .dropdown-menu > .active")
                    .removeClass("active")
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr("aria-expanded", !1), t.addClass("active")
                    .find('[data-toggle="tab"]')
                    .attr("aria-expanded", !0), a ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"), t.parent(".dropdown-menu")
                    .length && t.closest("li.dropdown")
                    .addClass("active")
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr("aria-expanded", !0), r && r()
            }
            var s = i.find("> .active"),
                a = r && e.support.transition && (s.length && s.hasClass("fade") || !!i.find("> .fade")
                    .length);
            s.length && a ? s.one("bsTransitionEnd", o)
                .emulateTransitionEnd(n.TRANSITION_DURATION) : o(), s.removeClass("in")
        };
        var i = e.fn.tab;
        e.fn.tab = t, e.fn.tab.Constructor = n, e.fn.tab.noConflict = function () {
            return e.fn.tab = i, this
        };
        var r = function (n) {
            n.preventDefault(), t.call(e(this), "show")
        };
        e(document)
            .on("click.bs.tab.data-api", '[data-toggle="tab"]', r)
            .on("click.bs.tab.data-api", '[data-toggle="pill"]', r)
    }(jQuery),
    /* ========================================================================
     * Bootstrap: transition.js v3.3.5
     * http://getbootstrap.com/javascript/#transitions
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t() {
            var e = document.createElement("bootstrap"),
                t = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                };
            for (var n in t)
                if (void 0 !== e.style[n]) return {
                    end: t[n]
                };
            return !1
        }
        e.fn.emulateTransitionEnd = function (t) {
            var n = !1,
                i = this;
            e(this)
                .one("bsTransitionEnd", function () {
                    n = !0
                });
            var r = function () {
                n || e(i)
                    .trigger(e.support.transition.end)
            };
            return setTimeout(r, t), this
        }, e(function () {
            e.support.transition = t(), e.support.transition && (e.event.special.bsTransitionEnd = {
                bindType: e.support.transition.end,
                delegateType: e.support.transition.end,
                handle: function (t) {
                    return e(t.target)
                        .is(this) ? t.handleObj.handler.apply(this, arguments) : void 0
                }
            })
        })
    }(jQuery),
    /* ========================================================================
     * Bootstrap: scrollspy.js v3.3.5
     * http://getbootstrap.com/javascript/#scrollspy
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(n, i) {
            this.$body = e(document.body), this.$scrollElement = e(e(n)
                .is(document.body) ? window : n), this.options = e.extend({}, t.DEFAULTS, i), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", e.proxy(this.process, this)), this.refresh(), this.process()
        }

        function n(n) {
            return this.each(function () {
                var i = e(this),
                    r = i.data("bs.scrollspy"),
                    o = "object" == typeof n && n;
                r || i.data("bs.scrollspy", r = new t(this, o)), "string" == typeof n && r[n]()
            })
        }
        t.VERSION = "3.3.5", t.DEFAULTS = {
            offset: 10
        }, t.prototype.getScrollHeight = function () {
            return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
        }, t.prototype.refresh = function () {
            var t = this,
                n = "offset",
                i = 0;
            this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), e.isWindow(this.$scrollElement[0]) || (n = "position", i = this.$scrollElement.scrollTop()), this.$body.find(this.selector)
                .map(function () {
                    var t = e(this),
                        r = t.data("target") || t.attr("href"),
                        o = /^#./.test(r) && e(r);
                    return o && o.length && o.is(":visible") && [
                        [o[n]()
                            .top + i, r
                        ]
                    ] || null
                })
                .sort(function (e, t) {
                    return e[0] - t[0]
                })
                .each(function () {
                    t.offsets.push(this[0]), t.targets.push(this[1])
                })
        }, t.prototype.process = function () {
            var e, t = this.$scrollElement.scrollTop() + this.options.offset,
                n = this.getScrollHeight(),
                i = this.options.offset + n - this.$scrollElement.height(),
                r = this.offsets,
                o = this.targets,
                s = this.activeTarget;
            if (this.scrollHeight != n && this.refresh(), t >= i) return s != (e = o[o.length - 1]) && this.activate(e);
            if (s && t < r[0]) return this.activeTarget = null, this.clear();
            for (e = r.length; e--;) s != o[e] && t >= r[e] && (void 0 === r[e + 1] || t < r[e + 1]) && this.activate(o[e])
        }, t.prototype.activate = function (t) {
            this.activeTarget = t, this.clear();
            var n = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
                i = e(n)
                .parents("li")
                .addClass("active");
            i.parent(".dropdown-menu")
                .length && (i = i.closest("li.dropdown")
                    .addClass("active")), i.trigger("activate.bs.scrollspy")
        }, t.prototype.clear = function () {
            e(this.selector)
                .parentsUntil(this.options.target, ".active")
                .removeClass("active")
        };
        var i = e.fn.scrollspy;
        e.fn.scrollspy = n, e.fn.scrollspy.Constructor = t, e.fn.scrollspy.noConflict = function () {
                return e.fn.scrollspy = i, this
            }, e(window)
            .on("load.bs.scrollspy.data-api", function () {
                e('[data-spy="scroll"]')
                    .each(function () {
                        var t = e(this);
                        n.call(t, t.data())
                    })
            })
    }(jQuery),
    /* ========================================================================
     * Bootstrap: modal.js v3.3.5
     * http://getbootstrap.com/javascript/#modals
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t, i) {
            return this.each(function () {
                var r = e(this),
                    o = r.data("bs.modal"),
                    s = e.extend({}, n.DEFAULTS, r.data(), "object" == typeof t && t);
                o || r.data("bs.modal", o = new n(this, s)), "string" == typeof t ? o[t](i) : s.show && o.show(i)
            })
        }
        var n = function (t, n) {
            this.options = n, this.$body = e(document.body), this.$element = e(t), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content")
                .load(this.options.remote, e.proxy(function () {
                    this.$element.trigger("loaded.bs.modal")
                }, this))
        };
        n.VERSION = "3.3.5", n.TRANSITION_DURATION = 300, n.BACKDROP_TRANSITION_DURATION = 150, n.DEFAULTS = {
            backdrop: !0,
            keyboard: !0,
            show: !0
        }, n.prototype.toggle = function (e) {
            return this.isShown ? this.hide() : this.show(e)
        }, n.prototype.show = function (t) {
            var i = this,
                r = e.Event("show.bs.modal", {
                    relatedTarget: t
                });
            this.$element.trigger(r), this.isShown || r.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function () {
                i.$element.one("mouseup.dismiss.bs.modal", function (t) {
                    e(t.target)
                        .is(i.$element) && (i.ignoreBackdropClick = !0)
                })
            }), this.backdrop(function () {
                var r = e.support.transition && i.$element.hasClass("fade");
                i.$element.parent()
                    .length || i.$element.appendTo(i.$body), i.$element.show()
                    .scrollTop(0), i.adjustDialog(), r && i.$element[0].offsetWidth, i.$element.addClass("in"), i.enforceFocus();
                var o = e.Event("shown.bs.modal", {
                    relatedTarget: t
                });
                r ? i.$dialog.one("bsTransitionEnd", function () {
                        i.$element.trigger("focus")
                            .trigger(o)
                    })
                    .emulateTransitionEnd(n.TRANSITION_DURATION) : i.$element.trigger("focus")
                    .trigger(o)
            }))
        }, n.prototype.hide = function (t) {
            t && t.preventDefault(), t = e.Event("hide.bs.modal"), this.$element.trigger(t), this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), e(document)
                .off("focusin.bs.modal"), this.$element.removeClass("in")
                .off("click.dismiss.bs.modal")
                .off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this))
                .emulateTransitionEnd(n.TRANSITION_DURATION) : this.hideModal())
        }, n.prototype.enforceFocus = function () {
            e(document)
                .off("focusin.bs.modal")
                .on("focusin.bs.modal", e.proxy(function (e) {
                    this.$element[0] === e.target || this.$element.has(e.target)
                        .length || this.$element.trigger("focus")
                }, this))
        }, n.prototype.escape = function () {
            this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", e.proxy(function (e) {
                27 == e.which && this.hide()
            }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
        }, n.prototype.resize = function () {
            this.isShown ? e(window)
                .on("resize.bs.modal", e.proxy(this.handleUpdate, this)) : e(window)
                .off("resize.bs.modal")
        }, n.prototype.hideModal = function () {
            var e = this;
            this.$element.hide(), this.backdrop(function () {
                e.$body.removeClass("modal-open"), e.resetAdjustments(), e.resetScrollbar(), e.$element.trigger("hidden.bs.modal")
            })
        }, n.prototype.removeBackdrop = function () {
            this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
        }, n.prototype.backdrop = function (t) {
            var i = this,
                r = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var o = e.support.transition && r;
                if (this.$backdrop = e(document.createElement("div"))
                    .addClass("modal-backdrop " + r)
                    .appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", e.proxy(function (e) {
                        return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
                    }, this)), o && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t) return;
                o ? this.$backdrop.one("bsTransitionEnd", t)
                    .emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : t()
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                var s = function () {
                    i.removeBackdrop(), t && t()
                };
                e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", s)
                    .emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : s()
            } else t && t()
        }, n.prototype.handleUpdate = function () {
            this.adjustDialog()
        }, n.prototype.adjustDialog = function () {
            var e = this.$element[0].scrollHeight > document.documentElement.clientHeight;
            this.$element.css({
                paddingLeft: !this.bodyIsOverflowing && e ? this.scrollbarWidth : "",
                paddingRight: this.bodyIsOverflowing && !e ? this.scrollbarWidth : ""
            })
        }, n.prototype.resetAdjustments = function () {
            this.$element.css({
                paddingLeft: "",
                paddingRight: ""
            })
        }, n.prototype.checkScrollbar = function () {
            var e = window.innerWidth;
            if (!e) {
                var t = document.documentElement.getBoundingClientRect();
                e = t.right - Math.abs(t.left)
            }
            this.bodyIsOverflowing = document.body.clientWidth < e, this.scrollbarWidth = this.measureScrollbar()
        }, n.prototype.setScrollbar = function () {
            var e = parseInt(this.$body.css("padding-right") || 0, 10);
            this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", e + this.scrollbarWidth)
        }, n.prototype.resetScrollbar = function () {
            this.$body.css("padding-right", this.originalBodyPad)
        }, n.prototype.measureScrollbar = function () {
            var e = document.createElement("div");
            e.className = "modal-scrollbar-measure", this.$body.append(e);
            var t = e.offsetWidth - e.clientWidth;
            return this.$body[0].removeChild(e), t
        };
        var i = e.fn.modal;
        e.fn.modal = t, e.fn.modal.Constructor = n, e.fn.modal.noConflict = function () {
                return e.fn.modal = i, this
            }, e(document)
            .on("click.bs.modal.data-api", '[data-toggle="modal"]', function (n) {
                var i = e(this),
                    r = i.attr("href"),
                    o = e(i.attr("data-target") || r && r.replace(/.*(?=#[^\s]+$)/, "")),
                    s = o.data("bs.modal") ? "toggle" : e.extend({
                        remote: !/#/.test(r) && r
                    }, o.data(), i.data());
                i.is("a") && n.preventDefault(), o.one("show.bs.modal", function (e) {
                    e.isDefaultPrevented() || o.one("hidden.bs.modal", function () {
                        i.is(":visible") && i.trigger("focus")
                    })
                }), t.call(o, s, this)
            })
    }(jQuery),
    /* ========================================================================
     * Bootstrap: tooltip.js v3.3.5
     * http://getbootstrap.com/javascript/#tooltip
     * Inspired by the original jQuery.tipsy by Jason Frame
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            return this.each(function () {
                var i = e(this),
                    r = i.data("bs.tooltip"),
                    o = "object" == typeof t && t;
                (r || !/destroy|hide/.test(t)) && (r || i.data("bs.tooltip", r = new n(this, o)), "string" == typeof t && r[t]())
            })
        }
        var n = function (e, t) {
            this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", e, t)
        };
        n.VERSION = "3.3.5", n.TRANSITION_DURATION = 150, n.DEFAULTS = {
            animation: !0,
            placement: "top",
            selector: !1,
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            container: !1,
            viewport: {
                selector: "body",
                padding: 0
            }
        }, n.prototype.init = function (t, n, i) {
            if (this.enabled = !0, this.type = t, this.$element = e(n), this.options = this.getOptions(i), this.$viewport = this.options.viewport && e(e.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                    click: !1,
                    hover: !1,
                    focus: !1
                }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
            for (var r = this.options.trigger.split(" "), o = r.length; o--;) {
                var s = r[o];
                if ("click" == s) this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this));
                else if ("manual" != s) {
                    var a = "hover" == s ? "mouseenter" : "focusin",
                        l = "hover" == s ? "mouseleave" : "focusout";
                    this.$element.on(a + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this))
                }
            }
            this.options.selector ? this._options = e.extend({}, this.options, {
                trigger: "manual",
                selector: ""
            }) : this.fixTitle()
        }, n.prototype.getDefaults = function () {
            return n.DEFAULTS
        }, n.prototype.getOptions = function (t) {
            return t = e.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && "number" == typeof t.delay && (t.delay = {
                show: t.delay,
                hide: t.delay
            }), t
        }, n.prototype.getDelegateOptions = function () {
            var t = {},
                n = this.getDefaults();
            return this._options && e.each(this._options, function (e, i) {
                n[e] != i && (t[e] = i)
            }), t
        }, n.prototype.enter = function (t) {
            var n = t instanceof this.constructor ? t : e(t.currentTarget)
                .data("bs." + this.type);
            return n || (n = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget)
                    .data("bs." + this.type, n)), t instanceof e.Event && (n.inState["focusin" == t.type ? "focus" : "hover"] = !0), n.tip()
                .hasClass("in") || "in" == n.hoverState ? void(n.hoverState = "in") : (clearTimeout(n.timeout), n.hoverState = "in", n.options.delay && n.options.delay.show ? void(n.timeout = setTimeout(function () {
                    "in" == n.hoverState && n.show()
                }, n.options.delay.show)) : n.show())
        }, n.prototype.isInStateTrue = function () {
            for (var e in this.inState)
                if (this.inState[e]) return !0;
            return !1
        }, n.prototype.leave = function (t) {
            var n = t instanceof this.constructor ? t : e(t.currentTarget)
                .data("bs." + this.type);
            return n || (n = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget)
                .data("bs." + this.type, n)), t instanceof e.Event && (n.inState["focusout" == t.type ? "focus" : "hover"] = !1), n.isInStateTrue() ? void 0 : (clearTimeout(n.timeout), n.hoverState = "out", n.options.delay && n.options.delay.hide ? void(n.timeout = setTimeout(function () {
                "out" == n.hoverState && n.hide()
            }, n.options.delay.hide)) : n.hide())
        }, n.prototype.show = function () {
            var t = e.Event("show.bs." + this.type);
            if (this.hasContent() && this.enabled) {
                this.$element.trigger(t);
                var i = e.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                if (t.isDefaultPrevented() || !i) return;
                var r = this,
                    o = this.tip(),
                    s = this.getUID(this.type);
                this.setContent(), o.attr("id", s), this.$element.attr("aria-describedby", s), this.options.animation && o.addClass("fade");
                var a = "function" == typeof this.options.placement ? this.options.placement.call(this, o[0], this.$element[0]) : this.options.placement,
                    l = /\s?auto?\s?/i,
                    c = l.test(a);
                c && (a = a.replace(l, "") || "top"), o.detach()
                    .css({
                        top: 0,
                        left: 0,
                        display: "block"
                    })
                    .addClass(a)
                    .data("bs." + this.type, this), this.options.container ? o.appendTo(this.options.container) : o.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
                var u = this.getPosition(),
                    d = o[0].offsetWidth,
                    p = o[0].offsetHeight;
                if (c) {
                    var f = a,
                        h = this.getPosition(this.$viewport);
                    a = "bottom" == a && u.bottom + p > h.bottom ? "top" : "top" == a && u.top - p < h.top ? "bottom" : "right" == a && u.right + d > h.width ? "left" : "left" == a && u.left - d < h.left ? "right" : a, o.removeClass(f)
                        .addClass(a)
                }
                var g = this.getCalculatedOffset(a, u, d, p);
                this.applyPlacement(g, a);
                var v = function () {
                    var e = r.hoverState;
                    r.$element.trigger("shown.bs." + r.type), r.hoverState = null, "out" == e && r.leave(r)
                };
                e.support.transition && this.$tip.hasClass("fade") ? o.one("bsTransitionEnd", v)
                    .emulateTransitionEnd(n.TRANSITION_DURATION) : v()
            }
        }, n.prototype.applyPlacement = function (t, n) {
            var i = this.tip(),
                r = i[0].offsetWidth,
                o = i[0].offsetHeight,
                s = parseInt(i.css("margin-top"), 10),
                a = parseInt(i.css("margin-left"), 10);
            isNaN(s) && (s = 0), isNaN(a) && (a = 0), t.top += s, t.left += a, e.offset.setOffset(i[0], e.extend({
                using: function (e) {
                    i.css({
                        top: Math.round(e.top),
                        left: Math.round(e.left)
                    })
                }
            }, t), 0), i.addClass("in");
            var l = i[0].offsetWidth,
                c = i[0].offsetHeight;
            "top" == n && c != o && (t.top = t.top + o - c);
            var u = this.getViewportAdjustedDelta(n, t, l, c);
            u.left ? t.left += u.left : t.top += u.top;
            var d = /top|bottom/.test(n),
                p = d ? 2 * u.left - r + l : 2 * u.top - o + c,
                f = d ? "offsetWidth" : "offsetHeight";
            i.offset(t), this.replaceArrow(p, i[0][f], d)
        }, n.prototype.replaceArrow = function (e, t, n) {
            this.arrow()
                .css(n ? "left" : "top", 50 * (1 - e / t) + "%")
                .css(n ? "top" : "left", "")
        }, n.prototype.setContent = function () {
            var e = this.tip(),
                t = this.getTitle();
            e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t), e.removeClass("fade in top bottom left right")
        }, n.prototype.hide = function (t) {
            function i() {
                "in" != r.hoverState && o.detach(), r.$element.removeAttr("aria-describedby")
                    .trigger("hidden.bs." + r.type), t && t()
            }
            var r = this,
                o = e(this.$tip),
                s = e.Event("hide.bs." + this.type);
            return this.$element.trigger(s), s.isDefaultPrevented() ? void 0 : (o.removeClass("in"), e.support.transition && o.hasClass("fade") ? o.one("bsTransitionEnd", i)
                .emulateTransitionEnd(n.TRANSITION_DURATION) : i(), this.hoverState = null, this)
        }, n.prototype.fixTitle = function () {
            var e = this.$element;
            (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "")
                .attr("title", "")
        }, n.prototype.hasContent = function () {
            return this.getTitle()
        }, n.prototype.getPosition = function (t) {
            t = t || this.$element;
            var n = t[0],
                i = "BODY" == n.tagName,
                r = n.getBoundingClientRect();
            null == r.width && (r = e.extend({}, r, {
                width: r.right - r.left,
                height: r.bottom - r.top
            }));
            var o = i ? {
                    top: 0,
                    left: 0
                } : t.offset(),
                s = {
                    scroll: i ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()
                },
                a = i ? {
                    width: e(window)
                        .width(),
                    height: e(window)
                        .height()
                } : null;
            return e.extend({}, r, s, a, o)
        }, n.prototype.getCalculatedOffset = function (e, t, n, i) {
            return "bottom" == e ? {
                top: t.top + t.height,
                left: t.left + t.width / 2 - n / 2
            } : "top" == e ? {
                top: t.top - i,
                left: t.left + t.width / 2 - n / 2
            } : "left" == e ? {
                top: t.top + t.height / 2 - i / 2,
                left: t.left - n
            } : {
                top: t.top + t.height / 2 - i / 2,
                left: t.left + t.width
            }
        }, n.prototype.getViewportAdjustedDelta = function (e, t, n, i) {
            var r = {
                top: 0,
                left: 0
            };
            if (!this.$viewport) return r;
            var o = this.options.viewport && this.options.viewport.padding || 0,
                s = this.getPosition(this.$viewport);
            if (/right|left/.test(e)) {
                var a = t.top - o - s.scroll,
                    l = t.top + o - s.scroll + i;
                a < s.top ? r.top = s.top - a : l > s.top + s.height && (r.top = s.top + s.height - l)
            } else {
                var c = t.left - o,
                    u = t.left + o + n;
                c < s.left ? r.left = s.left - c : u > s.right && (r.left = s.left + s.width - u)
            }
            return r
        }, n.prototype.getTitle = function () {
            var e, t = this.$element,
                n = this.options;
            return e = t.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(t[0]) : n.title)
        }, n.prototype.getUID = function (e) {
            do e += ~~(1e6 * Math.random()); while (document.getElementById(e));
            return e
        }, n.prototype.tip = function () {
            if (!this.$tip && (this.$tip = e(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
            return this.$tip
        }, n.prototype.arrow = function () {
            return this.$arrow = this.$arrow || this.tip()
                .find(".tooltip-arrow")
        }, n.prototype.enable = function () {
            this.enabled = !0
        }, n.prototype.disable = function () {
            this.enabled = !1
        }, n.prototype.toggleEnabled = function () {
            this.enabled = !this.enabled
        }, n.prototype.toggle = function (t) {
            var n = this;
            t && (n = e(t.currentTarget)
                    .data("bs." + this.type), n || (n = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget)
                        .data("bs." + this.type, n))), t ? (n.inState.click = !n.inState.click, n.isInStateTrue() ? n.enter(n) : n.leave(n)) : n.tip()
                .hasClass("in") ? n.leave(n) : n.enter(n)
        }, n.prototype.destroy = function () {
            var e = this;
            clearTimeout(this.timeout), this.hide(function () {
                e.$element.off("." + e.type)
                    .removeData("bs." + e.type), e.$tip && e.$tip.detach(), e.$tip = null, e.$arrow = null, e.$viewport = null
            })
        };
        var i = e.fn.tooltip;
        e.fn.tooltip = t, e.fn.tooltip.Constructor = n, e.fn.tooltip.noConflict = function () {
            return e.fn.tooltip = i, this
        }
    }(jQuery),
    /* ========================================================================
     * Bootstrap: popover.js v3.3.5
     * http://getbootstrap.com/javascript/#popovers
     * ========================================================================
     * Copyright 2011-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     * ======================================================================== */
    + function (e) {
        "use strict";

        function t(t) {
            return this.each(function () {
                var i = e(this),
                    r = i.data("bs.popover"),
                    o = "object" == typeof t && t;
                (r || !/destroy|hide/.test(t)) && (r || i.data("bs.popover", r = new n(this, o)), "string" == typeof t && r[t]())
            })
        }
        var n = function (e, t) {
            this.init("popover", e, t)
        };
        if (!e.fn.tooltip) throw new Error("Popover requires tooltip.js");
        n.VERSION = "3.3.5", n.DEFAULTS = e.extend({}, e.fn.tooltip.Constructor.DEFAULTS, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
        }), n.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype), n.prototype.constructor = n, n.prototype.getDefaults = function () {
            return n.DEFAULTS
        }, n.prototype.setContent = function () {
            var e = this.tip(),
                t = this.getTitle(),
                n = this.getContent();
            e.find(".popover-title")[this.options.html ? "html" : "text"](t), e.find(".popover-content")
                .children()
                .detach()
                .end()[this.options.html ? "string" == typeof n ? "html" : "append" : "text"](n), e.removeClass("fade top bottom left right in"), e.find(".popover-title")
                .html() || e.find(".popover-title")
                .hide()
        }, n.prototype.hasContent = function () {
            return this.getTitle() || this.getContent()
        }, n.prototype.getContent = function () {
            var e = this.$element,
                t = this.options;
            return e.attr("data-content") || ("function" == typeof t.content ? t.content.call(e[0]) : t.content)
        }, n.prototype.arrow = function () {
            return this.$arrow = this.$arrow || this.tip()
                .find(".arrow")
        };
        var i = e.fn.popover;
        e.fn.popover = t, e.fn.popover.Constructor = n, e.fn.popover.noConflict = function () {
            return e.fn.popover = i, this
        }
    }(jQuery), /*! Select2 4.0.2 | https://github.com/select2/select2/blob/master/LICENSE.md */ ! function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e("object" == typeof exports ? require("jquery") : jQuery)
    }(function (e) {
        var t = function () {
                if (e && e.fn && e.fn.select2 && e.fn.select2.amd) var t = e.fn.select2.amd;
                var t;
                return function () {
                        if (!t || !t.requirejs) {
                            t ? n = t : t = {};
                            var e, n, i;
                            ! function (t) {
                                function r(e, t) {
                                    return w.call(e, t)
                                }

                                function o(e, t) {
                                    var n, i, r, o, s, a, l, c, u, d, p, f = t && t.split("/"),
                                        h = y.map,
                                        g = h && h["*"] || {};
                                    if (e && "." === e.charAt(0))
                                        if (t) {
                                            for (e = e.split("/"), s = e.length - 1, y.nodeIdCompat && _.test(e[s]) && (e[s] = e[s].replace(_, "")), e = f.slice(0, f.length - 1)
                                                .concat(e), u = 0; u < e.length; u += 1)
                                                if (p = e[u], "." === p) e.splice(u, 1), u -= 1;
                                                else if (".." === p) {
                                                if (1 === u && (".." === e[2] || ".." === e[0])) break;
                                                u > 0 && (e.splice(u - 1, 2), u -= 2)
                                            }
                                            e = e.join("/")
                                        } else 0 === e.indexOf("./") && (e = e.substring(2));
                                    if ((f || g) && h) {
                                        for (n = e.split("/"), u = n.length; u > 0; u -= 1) {
                                            if (i = n.slice(0, u)
                                                .join("/"), f)
                                                for (d = f.length; d > 0; d -= 1)
                                                    if (r = h[f.slice(0, d)
                                                            .join("/")], r && (r = r[i])) {
                                                        o = r, a = u;
                                                        break
                                                    }
                                            if (o) break;
                                            !l && g && g[i] && (l = g[i], c = u)
                                        }!o && l && (o = l, a = c), o && (n.splice(0, a, o), e = n.join("/"))
                                    }
                                    return e
                                }

                                function s(e, n) {
                                    return function () {
                                        var i = x.call(arguments, 0);
                                        return "string" != typeof i[0] && 1 === i.length && i.push(null), f.apply(t, i.concat([e, n]))
                                    }
                                }

                                function a(e) {
                                    return function (t) {
                                        return o(t, e)
                                    }
                                }

                                function l(e) {
                                    return function (t) {
                                        v[e] = t
                                    }
                                }

                                function c(e) {
                                    if (r(m, e)) {
                                        var n = m[e];
                                        delete m[e], b[e] = !0, p.apply(t, n)
                                    }
                                    if (!r(v, e) && !r(b, e)) throw new Error("No " + e);
                                    return v[e]
                                }

                                function u(e) {
                                    var t, n = e ? e.indexOf("!") : -1;
                                    return n > -1 && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [t, e]
                                }

                                function d(e) {
                                    return function () {
                                        return y && y.config && y.config[e] || {}
                                    }
                                }
                                var p, f, h, g, v = {},
                                    m = {},
                                    y = {},
                                    b = {},
                                    w = Object.prototype.hasOwnProperty,
                                    x = [].slice,
                                    _ = /\.js$/;
                                h = function (e, t) {
                                    var n, i = u(e),
                                        r = i[0];
                                    return e = i[1], r && (r = o(r, t), n = c(r)), r ? e = n && n.normalize ? n.normalize(e, a(t)) : o(e, t) : (e = o(e, t), i = u(e), r = i[0], e = i[1], r && (n = c(r))), {
                                        f: r ? r + "!" + e : e,
                                        n: e,
                                        pr: r,
                                        p: n
                                    }
                                }, g = {
                                    require: function (e) {
                                        return s(e)
                                    },
                                    exports: function (e) {
                                        var t = v[e];
                                        return "undefined" != typeof t ? t : v[e] = {}
                                    },
                                    module: function (e) {
                                        return {
                                            id: e,
                                            uri: "",
                                            exports: v[e],
                                            config: d(e)
                                        }
                                    }
                                }, p = function (e, n, i, o) {
                                    var a, u, d, p, f, y, w = [],
                                        x = typeof i;
                                    if (o = o || e, "undefined" === x || "function" === x) {
                                        for (n = !n.length && i.length ? ["require", "exports", "module"] : n, f = 0; f < n.length; f += 1)
                                            if (p = h(n[f], o), u = p.f, "require" === u) w[f] = g.require(e);
                                            else if ("exports" === u) w[f] = g.exports(e), y = !0;
                                        else if ("module" === u) a = w[f] = g.module(e);
                                        else if (r(v, u) || r(m, u) || r(b, u)) w[f] = c(u);
                                        else {
                                            if (!p.p) throw new Error(e + " missing " + u);
                                            p.p.load(p.n, s(o, !0), l(u), {}), w[f] = v[u]
                                        }
                                        d = i ? i.apply(v[e], w) : void 0, e && (a && a.exports !== t && a.exports !== v[e] ? v[e] = a.exports : d === t && y || (v[e] = d))
                                    } else e && (v[e] = i)
                                }, e = n = f = function (e, n, i, r, o) {
                                    if ("string" == typeof e) return g[e] ? g[e](n) : c(h(e, n)
                                        .f);
                                    if (!e.splice) {
                                        if (y = e, y.deps && f(y.deps, y.callback), !n) return;
                                        n.splice ? (e = n, n = i, i = null) : e = t
                                    }
                                    return n = n || function () {}, "function" == typeof i && (i = r, r = o), r ? p(t, e, n, i) : setTimeout(function () {
                                        p(t, e, n, i)
                                    }, 4), f
                                }, f.config = function (e) {
                                    return f(e)
                                }, e._defined = v, i = function (e, t, n) {
                                    if ("string" != typeof e) throw new Error("See almond README: incorrect module build, no module name");
                                    t.splice || (n = t, t = []), r(v, e) || r(m, e) || (m[e] = [e, t, n])
                                }, i.amd = {
                                    jQuery: !0
                                }
                            }(), t.requirejs = e, t.require = n, t.define = i
                        }
                    }(), t.define("almond", function () {}), t.define("jquery", [], function () {
                        var t = e || $;
                        return null == t && console && console.error && console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."), t
                    }), t.define("select2/utils", ["jquery"], function (e) {
                        function t(e) {
                            var t = e.prototype,
                                n = [];
                            for (var i in t) {
                                var r = t[i];
                                "function" == typeof r && "constructor" !== i && n.push(i)
                            }
                            return n
                        }
                        var n = {};
                        n.Extend = function (e, t) {
                            function n() {
                                this.constructor = e
                            }
                            var i = {}.hasOwnProperty;
                            for (var r in t) i.call(t, r) && (e[r] = t[r]);
                            return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
                        }, n.Decorate = function (e, n) {
                            function i() {
                                var t = Array.prototype.unshift,
                                    i = n.prototype.constructor.length,
                                    r = e.prototype.constructor;
                                i > 0 && (t.call(arguments, e.prototype.constructor), r = n.prototype.constructor), r.apply(this, arguments)
                            }

                            function r() {
                                this.constructor = i
                            }
                            var o = t(n),
                                s = t(e);
                            n.displayName = e.displayName, i.prototype = new r;
                            for (var a = 0; a < s.length; a++) {
                                var l = s[a];
                                i.prototype[l] = e.prototype[l]
                            }
                            for (var c = (function (e) {
                                    var t = function () {};
                                    e in i.prototype && (t = i.prototype[e]);
                                    var r = n.prototype[e];
                                    return function () {
                                        var e = Array.prototype.unshift;
                                        return e.call(arguments, t), r.apply(this, arguments)
                                    }
                                }), u = 0; u < o.length; u++) {
                                var d = o[u];
                                i.prototype[d] = c(d)
                            }
                            return i
                        };
                        var i = function () {
                            this.listeners = {}
                        };
                        return i.prototype.on = function (e, t) {
                            this.listeners = this.listeners || {}, e in this.listeners ? this.listeners[e].push(t) : this.listeners[e] = [t]
                        }, i.prototype.trigger = function (e) {
                            var t = Array.prototype.slice;
                            this.listeners = this.listeners || {}, e in this.listeners && this.invoke(this.listeners[e], t.call(arguments, 1)), "*" in this.listeners && this.invoke(this.listeners["*"], arguments)
                        }, i.prototype.invoke = function (e, t) {
                            for (var n = 0, i = e.length; i > n; n++) e[n].apply(this, t)
                        }, n.Observable = i, n.generateChars = function (e) {
                            for (var t = "", n = 0; e > n; n++) {
                                var i = Math.floor(36 * Math.random());
                                t += i.toString(36)
                            }
                            return t
                        }, n.bind = function (e, t) {
                            return function () {
                                e.apply(t, arguments)
                            }
                        }, n._convertData = function (e) {
                            for (var t in e) {
                                var n = t.split("-"),
                                    i = e;
                                if (1 !== n.length) {
                                    for (var r = 0; r < n.length; r++) {
                                        var o = n[r];
                                        o = o.substring(0, 1)
                                            .toLowerCase() + o.substring(1), o in i || (i[o] = {}), r == n.length - 1 && (i[o] = e[t]), i = i[o]
                                    }
                                    delete e[t]
                                }
                            }
                            return e
                        }, n.hasScroll = function (t, n) {
                            var i = e(n),
                                r = n.style.overflowX,
                                o = n.style.overflowY;
                            return r !== o || "hidden" !== o && "visible" !== o ? "scroll" === r || "scroll" === o ? !0 : i.innerHeight() < n.scrollHeight || i.innerWidth() < n.scrollWidth : !1
                        }, n.escapeMarkup = function (e) {
                            var t = {
                                "\\": "&#92;",
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#39;",
                                "/": "&#47;"
                            };
                            return "string" != typeof e ? e : String(e)
                                .replace(/[&<>"'\/\\]/g, function (e) {
                                    return t[e]
                                })
                        }, n.appendMany = function (t, n) {
                            if ("1.7" === e.fn.jquery.substr(0, 3)) {
                                var i = e();
                                e.map(n, function (e) {
                                    i = i.add(e)
                                }), n = i
                            }
                            t.append(n)
                        }, n
                    }), t.define("select2/results", ["jquery", "./utils"], function (e, t) {
                        function n(e, t, i) {
                            this.$element = e, this.data = i, this.options = t, n.__super__.constructor.call(this)
                        }
                        return t.Extend(n, t.Observable), n.prototype.render = function () {
                            var t = e('<ul class="select2-results__options" role="tree"></ul>');
                            return this.options.get("multiple") && t.attr("aria-multiselectable", "true"), this.$results = t, t
                        }, n.prototype.clear = function () {
                            this.$results.empty()
                        }, n.prototype.displayMessage = function (t) {
                            var n = this.options.get("escapeMarkup");
                            this.clear(), this.hideLoading();
                            var i = e('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),
                                r = this.options.get("translations")
                                .get(t.message);
                            i.append(n(r(t.args))), i[0].className += " select2-results__message", this.$results.append(i)
                        }, n.prototype.hideMessages = function () {
                            this.$results.find(".select2-results__message")
                                .remove()
                        }, n.prototype.append = function (e) {
                            this.hideLoading();
                            var t = [];
                            if (null == e.results || 0 === e.results.length) return void(0 === this.$results.children()
                                .length && this.trigger("results:message", {
                                    message: "noResults"
                                }));
                            e.results = this.sort(e.results);
                            for (var n = 0; n < e.results.length; n++) {
                                var i = e.results[n],
                                    r = this.option(i);
                                t.push(r)
                            }
                            this.$results.append(t)
                        }, n.prototype.position = function (e, t) {
                            var n = t.find(".select2-results");
                            n.append(e)
                        }, n.prototype.sort = function (e) {
                            var t = this.options.get("sorter");
                            return t(e)
                        }, n.prototype.setClasses = function () {
                            var t = this;
                            this.data.current(function (n) {
                                var i = e.map(n, function (e) {
                                        return e.id.toString()
                                    }),
                                    r = t.$results.find(".select2-results__option[aria-selected]");
                                r.each(function () {
                                    var t = e(this),
                                        n = e.data(this, "data"),
                                        r = "" + n.id;
                                    null != n.element && n.element.selected || null == n.element && e.inArray(r, i) > -1 ? t.attr("aria-selected", "true") : t.attr("aria-selected", "false")
                                });
                                var o = r.filter("[aria-selected=true]");
                                o.length > 0 ? o.first()
                                    .trigger("mouseenter") : r.first()
                                    .trigger("mouseenter")
                            })
                        }, n.prototype.showLoading = function (e) {
                            this.hideLoading();
                            var t = this.options.get("translations")
                                .get("searching"),
                                n = {
                                    disabled: !0,
                                    loading: !0,
                                    text: t(e)
                                },
                                i = this.option(n);
                            i.className += " loading-results", this.$results.prepend(i)
                        }, n.prototype.hideLoading = function () {
                            this.$results.find(".loading-results")
                                .remove()
                        }, n.prototype.option = function (t) {
                            var n = document.createElement("li");
                            n.className = "select2-results__option";
                            var i = {
                                role: "treeitem",
                                "aria-selected": "false"
                            };
                            t.disabled && (delete i["aria-selected"], i["aria-disabled"] = "true"), null == t.id && delete i["aria-selected"], null != t._resultId && (n.id = t._resultId), t.title && (n.title = t.title), t.children && (i.role = "group", i["aria-label"] = t.text, delete i["aria-selected"]);
                            for (var r in i) {
                                var o = i[r];
                                n.setAttribute(r, o)
                            }
                            if (t.children) {
                                var s = e(n),
                                    a = document.createElement("strong");
                                a.className = "select2-results__group", e(a), this.template(t, a);
                                for (var l = [], c = 0; c < t.children.length; c++) {
                                    var u = t.children[c],
                                        d = this.option(u);
                                    l.push(d)
                                }
                                var p = e("<ul></ul>", {
                                    "class": "select2-results__options select2-results__options--nested"
                                });
                                p.append(l), s.append(a), s.append(p)
                            } else this.template(t, n);
                            return e.data(n, "data", t), n
                        }, n.prototype.bind = function (t, n) {
                            var i = this,
                                r = t.id + "-results";
                            this.$results.attr("id", r), t.on("results:all", function (e) {
                                i.clear(), i.append(e.data), t.isOpen() && i.setClasses()
                            }), t.on("results:append", function (e) {
                                i.append(e.data), t.isOpen() && i.setClasses()
                            }), t.on("query", function (e) {
                                i.hideMessages(), i.showLoading(e)
                            }), t.on("select", function () {
                                t.isOpen() && i.setClasses()
                            }), t.on("unselect", function () {
                                t.isOpen() && i.setClasses()
                            }), t.on("open", function () {
                                i.$results.attr("aria-expanded", "true"), i.$results.attr("aria-hidden", "false"), i.setClasses(), i.ensureHighlightVisible()
                            }), t.on("close", function () {
                                i.$results.attr("aria-expanded", "false"), i.$results.attr("aria-hidden", "true"), i.$results.removeAttr("aria-activedescendant")
                            }), t.on("results:toggle", function () {
                                var e = i.getHighlightedResults();
                                0 !== e.length && e.trigger("mouseup")
                            }), t.on("results:select", function () {
                                var e = i.getHighlightedResults();
                                if (0 !== e.length) {
                                    var t = e.data("data");
                                    "true" == e.attr("aria-selected") ? i.trigger("close", {}) : i.trigger("select", {
                                        data: t
                                    })
                                }
                            }), t.on("results:previous", function () {
                                var e = i.getHighlightedResults(),
                                    t = i.$results.find("[aria-selected]"),
                                    n = t.index(e);
                                if (0 !== n) {
                                    var r = n - 1;
                                    0 === e.length && (r = 0);
                                    var o = t.eq(r);
                                    o.trigger("mouseenter");
                                    var s = i.$results.offset()
                                        .top,
                                        a = o.offset()
                                        .top,
                                        l = i.$results.scrollTop() + (a - s);
                                    0 === r ? i.$results.scrollTop(0) : 0 > a - s && i.$results.scrollTop(l)
                                }
                            }), t.on("results:next", function () {
                                var e = i.getHighlightedResults(),
                                    t = i.$results.find("[aria-selected]"),
                                    n = t.index(e),
                                    r = n + 1;
                                if (!(r >= t.length)) {
                                    var o = t.eq(r);
                                    o.trigger("mouseenter");
                                    var s = i.$results.offset()
                                        .top + i.$results.outerHeight(!1),
                                        a = o.offset()
                                        .top + o.outerHeight(!1),
                                        l = i.$results.scrollTop() + a - s;
                                    0 === r ? i.$results.scrollTop(0) : a > s && i.$results.scrollTop(l)
                                }
                            }), t.on("results:focus", function (e) {
                                e.element.addClass("select2-results__option--highlighted")
                            }), t.on("results:message", function (e) {
                                i.displayMessage(e)
                            }), e.fn.mousewheel && this.$results.on("mousewheel", function (e) {
                                var t = i.$results.scrollTop(),
                                    n = i.$results.get(0)
                                    .scrollHeight - t + e.deltaY,
                                    r = e.deltaY > 0 && t - e.deltaY <= 0,
                                    o = e.deltaY < 0 && n <= i.$results.height();
                                r ? (i.$results.scrollTop(0), e.preventDefault(), e.stopPropagation()) : o && (i.$results.scrollTop(i.$results.get(0)
                                    .scrollHeight - i.$results.height()), e.preventDefault(), e.stopPropagation())
                            }), this.$results.on("mouseup", ".select2-results__option[aria-selected]", function (t) {
                                var n = e(this),
                                    r = n.data("data");
                                return "true" === n.attr("aria-selected") ? void(i.options.get("multiple") ? i.trigger("unselect", {
                                    originalEvent: t,
                                    data: r
                                }) : i.trigger("close", {})) : void i.trigger("select", {
                                    originalEvent: t,
                                    data: r
                                })
                            }), this.$results.on("mouseenter", ".select2-results__option[aria-selected]", function (t) {
                                var n = e(this)
                                    .data("data");
                                i.getHighlightedResults()
                                    .removeClass("select2-results__option--highlighted"), i.trigger("results:focus", {
                                        data: n,
                                        element: e(this)
                                    })
                            })
                        }, n.prototype.getHighlightedResults = function () {
                            var e = this.$results.find(".select2-results__option--highlighted");
                            return e
                        }, n.prototype.destroy = function () {
                            this.$results.remove()
                        }, n.prototype.ensureHighlightVisible = function () {
                            var e = this.getHighlightedResults();
                            if (0 !== e.length) {
                                var t = this.$results.find("[aria-selected]"),
                                    n = t.index(e),
                                    i = this.$results.offset()
                                    .top,
                                    r = e.offset()
                                    .top,
                                    o = this.$results.scrollTop() + (r - i),
                                    s = r - i;
                                o -= 2 * e.outerHeight(!1), 2 >= n ? this.$results.scrollTop(0) : (s > this.$results.outerHeight() || 0 > s) && this.$results.scrollTop(o)
                            }
                        }, n.prototype.template = function (t, n) {
                            var i = this.options.get("templateResult"),
                                r = this.options.get("escapeMarkup"),
                                o = i(t, n);
                            null == o ? n.style.display = "none" : "string" == typeof o ? n.innerHTML = r(o) : e(n)
                                .append(o)
                        }, n
                    }), t.define("select2/keys", [], function () {
                        var e = {
                            BACKSPACE: 8,
                            TAB: 9,
                            ENTER: 13,
                            SHIFT: 16,
                            CTRL: 17,
                            ALT: 18,
                            ESC: 27,
                            SPACE: 32,
                            PAGE_UP: 33,
                            PAGE_DOWN: 34,
                            END: 35,
                            HOME: 36,
                            LEFT: 37,
                            UP: 38,
                            RIGHT: 39,
                            DOWN: 40,
                            DELETE: 46
                        };
                        return e
                    }), t.define("select2/selection/base", ["jquery", "../utils", "../keys"], function (e, t, n) {
                        function i(e, t) {
                            this.$element = e, this.options = t, i.__super__.constructor.call(this)
                        }
                        return t.Extend(i, t.Observable), i.prototype.render = function () {
                            var t = e('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');
                            return this._tabindex = 0, null != this.$element.data("old-tabindex") ? this._tabindex = this.$element.data("old-tabindex") : null != this.$element.attr("tabindex") && (this._tabindex = this.$element.attr("tabindex")), t.attr("title", this.$element.attr("title")), t.attr("tabindex", this._tabindex), this.$selection = t, t
                        }, i.prototype.bind = function (e, t) {
                            var i = this,
                                r = (e.id + "-container", e.id + "-results");
                            this.container = e, this.$selection.on("focus", function (e) {
                                i.trigger("focus", e)
                            }), this.$selection.on("blur", function (e) {
                                i._handleBlur(e)
                            }), this.$selection.on("keydown", function (e) {
                                i.trigger("keypress", e), e.which === n.SPACE && e.preventDefault()
                            }), e.on("results:focus", function (e) {
                                i.$selection.attr("aria-activedescendant", e.data._resultId)
                            }), e.on("selection:update", function (e) {
                                i.update(e.data)
                            }), e.on("open", function () {
                                i.$selection.attr("aria-expanded", "true"), i.$selection.attr("aria-owns", r), i._attachCloseHandler(e)
                            }), e.on("close", function () {
                                i.$selection.attr("aria-expanded", "false"), i.$selection.removeAttr("aria-activedescendant"), i.$selection.removeAttr("aria-owns"), i.$selection.focus(), i._detachCloseHandler(e)
                            }), e.on("enable", function () {
                                i.$selection.attr("tabindex", i._tabindex)
                            }), e.on("disable", function () {
                                i.$selection.attr("tabindex", "-1")
                            })
                        }, i.prototype._handleBlur = function (t) {
                            var n = this;
                            window.setTimeout(function () {
                                document.activeElement == n.$selection[0] || e.contains(n.$selection[0], document.activeElement) || n.trigger("blur", t)
                            }, 1)
                        }, i.prototype._attachCloseHandler = function (t) {
                            e(document.body)
                                .on("mousedown.select2." + t.id, function (t) {
                                    var n = e(t.target),
                                        i = n.closest(".select2"),
                                        r = e(".select2.select2-container--open");
                                    r.each(function () {
                                        var t = e(this);
                                        if (this != i[0]) {
                                            var n = t.data("element");
                                            n.select2("close")
                                        }
                                    })
                                })
                        }, i.prototype._detachCloseHandler = function (t) {
                            e(document.body)
                                .off("mousedown.select2." + t.id)
                        }, i.prototype.position = function (e, t) {
                            var n = t.find(".selection");
                            n.append(e)
                        }, i.prototype.destroy = function () {
                            this._detachCloseHandler(this.container)
                        }, i.prototype.update = function (e) {
                            throw new Error("The `update` method must be defined in child classes.")
                        }, i
                    }), t.define("select2/selection/single", ["jquery", "./base", "../utils", "../keys"], function (e, t, n, i) {
                        function r() {
                            r.__super__.constructor.apply(this, arguments)
                        }
                        return n.Extend(r, t), r.prototype.render = function () {
                            var e = r.__super__.render.call(this);
                            return e.addClass("select2-selection--single"), e.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'), e
                        }, r.prototype.bind = function (e, t) {
                            var n = this;
                            r.__super__.bind.apply(this, arguments);
                            var i = e.id + "-container";
                            this.$selection.find(".select2-selection__rendered")
                                .attr("id", i), this.$selection.attr("aria-labelledby", i), this.$selection.on("mousedown", function (e) {
                                    1 === e.which && n.trigger("toggle", {
                                        originalEvent: e
                                    })
                                }), this.$selection.on("focus", function (e) {}), this.$selection.on("blur", function (e) {}), e.on("selection:update", function (e) {
                                    n.update(e.data)
                                })
                        }, r.prototype.clear = function () {
                            this.$selection.find(".select2-selection__rendered")
                                .empty()
                        }, r.prototype.display = function (e, t) {
                            var n = this.options.get("templateSelection"),
                                i = this.options.get("escapeMarkup");
                            return i(n(e, t))
                        }, r.prototype.selectionContainer = function () {
                            return e("<span></span>")
                        }, r.prototype.update = function (e) {
                            if (0 === e.length) return void this.clear();
                            var t = e[0],
                                n = this.$selection.find(".select2-selection__rendered"),
                                i = this.display(t, n);
                            n.empty()
                                .append(i), n.prop("title", t.title || t.text)
                        }, r
                    }), t.define("select2/selection/multiple", ["jquery", "./base", "../utils"], function (e, t, n) {
                        function i(e, t) {
                            i.__super__.constructor.apply(this, arguments)
                        }
                        return n.Extend(i, t), i.prototype.render = function () {
                            var e = i.__super__.render.call(this);
                            return e.addClass("select2-selection--multiple"), e.html('<ul class="select2-selection__rendered"></ul>'), e
                        }, i.prototype.bind = function (t, n) {
                            var r = this;
                            i.__super__.bind.apply(this, arguments), this.$selection.on("click", function (e) {
                                r.trigger("toggle", {
                                    originalEvent: e
                                })
                            }), this.$selection.on("click", ".select2-selection__choice__remove", function (t) {
                                if (!r.options.get("disabled")) {
                                    var n = e(this),
                                        i = n.parent(),
                                        o = i.data("data");
                                    r.trigger("unselect", {
                                        originalEvent: t,
                                        data: o
                                    })
                                }
                            })
                        }, i.prototype.clear = function () {
                            this.$selection.find(".select2-selection__rendered")
                                .empty()
                        }, i.prototype.display = function (e, t) {
                            var n = this.options.get("templateSelection"),
                                i = this.options.get("escapeMarkup");
                            return i(n(e, t))
                        }, i.prototype.selectionContainer = function () {
                            var t = e('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');
                            return t
                        }, i.prototype.update = function (e) {
                            if (this.clear(), 0 !== e.length) {
                                for (var t = [], i = 0; i < e.length; i++) {
                                    var r = e[i],
                                        o = this.selectionContainer(),
                                        s = this.display(r, o);
                                    o.append(s), o.prop("title", r.title || r.text), o.data("data", r), t.push(o)
                                }
                                var a = this.$selection.find(".select2-selection__rendered");
                                n.appendMany(a, t)
                            }
                        }, i
                    }), t.define("select2/selection/placeholder", ["../utils"], function (e) {
                        function t(e, t, n) {
                            this.placeholder = this.normalizePlaceholder(n.get("placeholder")), e.call(this, t, n)
                        }
                        return t.prototype.normalizePlaceholder = function (e, t) {
                            return "string" == typeof t && (t = {
                                id: "",
                                text: t
                            }), t
                        }, t.prototype.createPlaceholder = function (e, t) {
                            var n = this.selectionContainer();
                            return n.html(this.display(t)), n.addClass("select2-selection__placeholder")
                                .removeClass("select2-selection__choice"), n
                        }, t.prototype.update = function (e, t) {
                            var n = 1 == t.length && t[0].id != this.placeholder.id,
                                i = t.length > 1;
                            if (i || n) return e.call(this, t);
                            this.clear();
                            var r = this.createPlaceholder(this.placeholder);
                            this.$selection.find(".select2-selection__rendered")
                                .append(r)
                        }, t
                    }), t.define("select2/selection/allowClear", ["jquery", "../keys"], function (e, t) {
                        function n() {}
                        return n.prototype.bind = function (e, t, n) {
                            var i = this;
                            e.call(this, t, n), null == this.placeholder && this.options.get("debug") && window.console && console.error && console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."), this.$selection.on("mousedown", ".select2-selection__clear", function (e) {
                                i._handleClear(e)
                            }), t.on("keypress", function (e) {
                                i._handleKeyboardClear(e, t)
                            })
                        }, n.prototype._handleClear = function (e, t) {
                            if (!this.options.get("disabled")) {
                                var n = this.$selection.find(".select2-selection__clear");
                                if (0 !== n.length) {
                                    t.stopPropagation();
                                    for (var i = n.data("data"), r = 0; r < i.length; r++) {
                                        var o = {
                                            data: i[r]
                                        };
                                        if (this.trigger("unselect", o), o.prevented) return
                                    }
                                    this.$element.val(this.placeholder.id)
                                        .trigger("change"), this.trigger("toggle", {})
                                }
                            }
                        }, n.prototype._handleKeyboardClear = function (e, n, i) {
                            i.isOpen() || (n.which == t.DELETE || n.which == t.BACKSPACE) && this._handleClear(n)
                        }, n.prototype.update = function (t, n) {
                            if (t.call(this, n), !(this.$selection.find(".select2-selection__placeholder")
                                    .length > 0 || 0 === n.length)) {
                                var i = e('<span class="select2-selection__clear">&times;</span>');
                                i.data("data", n), this.$selection.find(".select2-selection__rendered")
                                    .prepend(i)
                            }
                        }, n
                    }), t.define("select2/selection/search", ["jquery", "../utils", "../keys"], function (e, t, n) {
                        function i(e, t, n) {
                            e.call(this, t, n)
                        }
                        return i.prototype.render = function (t) {
                            var n = e('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');
                            this.$searchContainer = n, this.$search = n.find("input");
                            var i = t.call(this);
                            return this._transferTabIndex(), i
                        }, i.prototype.bind = function (e, t, i) {
                            var r = this;
                            e.call(this, t, i), t.on("open", function () {
                                r.$search.trigger("focus")
                            }), t.on("close", function () {
                                r.$search.val(""), r.$search.removeAttr("aria-activedescendant"), r.$search.trigger("focus")
                            }), t.on("enable", function () {
                                r.$search.prop("disabled", !1), r._transferTabIndex()
                            }), t.on("disable", function () {
                                r.$search.prop("disabled", !0)
                            }), t.on("focus", function (e) {
                                r.$search.trigger("focus")
                            }), t.on("results:focus", function (e) {
                                r.$search.attr("aria-activedescendant", e.id)
                            }), this.$selection.on("focusin", ".select2-search--inline", function (e) {
                                r.trigger("focus", e)
                            }), this.$selection.on("focusout", ".select2-search--inline", function (e) {
                                r._handleBlur(e)
                            }), this.$selection.on("keydown", ".select2-search--inline", function (e) {
                                e.stopPropagation(), r.trigger("keypress", e), r._keyUpPrevented = e.isDefaultPrevented();
                                var t = e.which;
                                if (t === n.BACKSPACE && "" === r.$search.val()) {
                                    var i = r.$searchContainer.prev(".select2-selection__choice");
                                    if (i.length > 0) {
                                        var o = i.data("data");
                                        r.searchRemoveChoice(o), e.preventDefault()
                                    }
                                }
                            });
                            var o = document.documentMode,
                                s = o && 11 >= o;
                            this.$selection.on("input.searchcheck", ".select2-search--inline", function (e) {
                                return s ? void r.$selection.off("input.search input.searchcheck") : void r.$selection.off("keyup.search")
                            }), this.$selection.on("keyup.search input.search", ".select2-search--inline", function (e) {
                                if (s && "input" === e.type) return void r.$selection.off("input.search input.searchcheck");
                                var t = e.which;
                                t != n.SHIFT && t != n.CTRL && t != n.ALT && t != n.TAB && r.handleSearch(e)
                            })
                        }, i.prototype._transferTabIndex = function (e) {
                            this.$search.attr("tabindex", this.$selection.attr("tabindex")), this.$selection.attr("tabindex", "-1")
                        }, i.prototype.createPlaceholder = function (e, t) {
                            this.$search.attr("placeholder", t.text)
                        }, i.prototype.update = function (e, t) {
                            var n = this.$search[0] == document.activeElement;
                            this.$search.attr("placeholder", ""), e.call(this, t), this.$selection.find(".select2-selection__rendered")
                                .append(this.$searchContainer), this.resizeSearch(), n && this.$search.focus()
                        }, i.prototype.handleSearch = function () {
                            if (this.resizeSearch(), !this._keyUpPrevented) {
                                var e = this.$search.val();
                                this.trigger("query", {
                                    term: e
                                })
                            }
                            this._keyUpPrevented = !1
                        }, i.prototype.searchRemoveChoice = function (e, t) {
                            this.trigger("unselect", {
                                data: t
                            }), this.$search.val(t.text), this.handleSearch()
                        }, i.prototype.resizeSearch = function () {
                            this.$search.css("width", "25px");
                            var e = "";
                            if ("" !== this.$search.attr("placeholder")) e = this.$selection.find(".select2-selection__rendered")
                                .innerWidth();
                            else {
                                var t = this.$search.val()
                                    .length + 1;
                                e = .75 * t + "em"
                            }
                            this.$search.css("width", e)
                        }, i
                    }), t.define("select2/selection/eventRelay", ["jquery"], function (e) {
                        function t() {}
                        return t.prototype.bind = function (t, n, i) {
                            var r = this,
                                o = ["open", "opening", "close", "closing", "select", "selecting", "unselect", "unselecting"],
                                s = ["opening", "closing", "selecting", "unselecting"];
                            t.call(this, n, i), n.on("*", function (t, n) {
                                if (-1 !== e.inArray(t, o)) {
                                    n = n || {};
                                    var i = e.Event("select2:" + t, {
                                        params: n
                                    });
                                    r.$element.trigger(i), -1 !== e.inArray(t, s) && (n.prevented = i.isDefaultPrevented())
                                }
                            })
                        }, t
                    }), t.define("select2/translation", ["jquery", "require"], function (e, t) {
                        function n(e) {
                            this.dict = e || {}
                        }
                        return n.prototype.all = function () {
                            return this.dict
                        }, n.prototype.get = function (e) {
                            return this.dict[e]
                        }, n.prototype.extend = function (t) {
                            this.dict = e.extend({}, t.all(), this.dict)
                        }, n._cache = {}, n.loadPath = function (e) {
                            if (!(e in n._cache)) {
                                var i = t(e);
                                n._cache[e] = i
                            }
                            return new n(n._cache[e])
                        }, n
                    }), t.define("select2/diacritics", [], function () {
                        var e = {
                            "\u24b6": "A",
                            "\uff21": "A",
                            "\xc0": "A",
                            "\xc1": "A",
                            "\xc2": "A",
                            "\u1ea6": "A",
                            "\u1ea4": "A",
                            "\u1eaa": "A",
                            "\u1ea8": "A",
                            "\xc3": "A",
                            "\u0100": "A",
                            "\u0102": "A",
                            "\u1eb0": "A",
                            "\u1eae": "A",
                            "\u1eb4": "A",
                            "\u1eb2": "A",
                            "\u0226": "A",
                            "\u01e0": "A",
                            "\xc4": "A",
                            "\u01de": "A",
                            "\u1ea2": "A",
                            "\xc5": "A",
                            "\u01fa": "A",
                            "\u01cd": "A",
                            "\u0200": "A",
                            "\u0202": "A",
                            "\u1ea0": "A",
                            "\u1eac": "A",
                            "\u1eb6": "A",
                            "\u1e00": "A",
                            "\u0104": "A",
                            "\u023a": "A",
                            "\u2c6f": "A",
                            "\ua732": "AA",
                            "\xc6": "AE",
                            "\u01fc": "AE",
                            "\u01e2": "AE",
                            "\ua734": "AO",
                            "\ua736": "AU",
                            "\ua738": "AV",
                            "\ua73a": "AV",
                            "\ua73c": "AY",
                            "\u24b7": "B",
                            "\uff22": "B",
                            "\u1e02": "B",
                            "\u1e04": "B",
                            "\u1e06": "B",
                            "\u0243": "B",
                            "\u0182": "B",
                            "\u0181": "B",
                            "\u24b8": "C",
                            "\uff23": "C",
                            "\u0106": "C",
                            "\u0108": "C",
                            "\u010a": "C",
                            "\u010c": "C",
                            "\xc7": "C",
                            "\u1e08": "C",
                            "\u0187": "C",
                            "\u023b": "C",
                            "\ua73e": "C",
                            "\u24b9": "D",
                            "\uff24": "D",
                            "\u1e0a": "D",
                            "\u010e": "D",
                            "\u1e0c": "D",
                            "\u1e10": "D",
                            "\u1e12": "D",
                            "\u1e0e": "D",
                            "\u0110": "D",
                            "\u018b": "D",
                            "\u018a": "D",
                            "\u0189": "D",
                            "\ua779": "D",
                            "\u01f1": "DZ",
                            "\u01c4": "DZ",
                            "\u01f2": "Dz",
                            "\u01c5": "Dz",
                            "\u24ba": "E",
                            "\uff25": "E",
                            "\xc8": "E",
                            "\xc9": "E",
                            "\xca": "E",
                            "\u1ec0": "E",
                            "\u1ebe": "E",
                            "\u1ec4": "E",
                            "\u1ec2": "E",
                            "\u1ebc": "E",
                            "\u0112": "E",
                            "\u1e14": "E",
                            "\u1e16": "E",
                            "\u0114": "E",
                            "\u0116": "E",
                            "\xcb": "E",
                            "\u1eba": "E",
                            "\u011a": "E",
                            "\u0204": "E",
                            "\u0206": "E",
                            "\u1eb8": "E",
                            "\u1ec6": "E",
                            "\u0228": "E",
                            "\u1e1c": "E",
                            "\u0118": "E",
                            "\u1e18": "E",
                            "\u1e1a": "E",
                            "\u0190": "E",
                            "\u018e": "E",
                            "\u24bb": "F",
                            "\uff26": "F",
                            "\u1e1e": "F",
                            "\u0191": "F",
                            "\ua77b": "F",
                            "\u24bc": "G",
                            "\uff27": "G",
                            "\u01f4": "G",
                            "\u011c": "G",
                            "\u1e20": "G",
                            "\u011e": "G",
                            "\u0120": "G",
                            "\u01e6": "G",
                            "\u0122": "G",
                            "\u01e4": "G",
                            "\u0193": "G",
                            "\ua7a0": "G",
                            "\ua77d": "G",
                            "\ua77e": "G",
                            "\u24bd": "H",
                            "\uff28": "H",
                            "\u0124": "H",
                            "\u1e22": "H",
                            "\u1e26": "H",
                            "\u021e": "H",
                            "\u1e24": "H",
                            "\u1e28": "H",
                            "\u1e2a": "H",
                            "\u0126": "H",
                            "\u2c67": "H",
                            "\u2c75": "H",
                            "\ua78d": "H",
                            "\u24be": "I",
                            "\uff29": "I",
                            "\xcc": "I",
                            "\xcd": "I",
                            "\xce": "I",
                            "\u0128": "I",
                            "\u012a": "I",
                            "\u012c": "I",
                            "\u0130": "I",
                            "\xcf": "I",
                            "\u1e2e": "I",
                            "\u1ec8": "I",
                            "\u01cf": "I",
                            "\u0208": "I",
                            "\u020a": "I",
                            "\u1eca": "I",
                            "\u012e": "I",
                            "\u1e2c": "I",
                            "\u0197": "I",
                            "\u24bf": "J",
                            "\uff2a": "J",
                            "\u0134": "J",
                            "\u0248": "J",
                            "\u24c0": "K",
                            "\uff2b": "K",
                            "\u1e30": "K",
                            "\u01e8": "K",
                            "\u1e32": "K",
                            "\u0136": "K",
                            "\u1e34": "K",
                            "\u0198": "K",
                            "\u2c69": "K",
                            "\ua740": "K",
                            "\ua742": "K",
                            "\ua744": "K",
                            "\ua7a2": "K",
                            "\u24c1": "L",
                            "\uff2c": "L",
                            "\u013f": "L",
                            "\u0139": "L",
                            "\u013d": "L",
                            "\u1e36": "L",
                            "\u1e38": "L",
                            "\u013b": "L",
                            "\u1e3c": "L",
                            "\u1e3a": "L",
                            "\u0141": "L",
                            "\u023d": "L",
                            "\u2c62": "L",
                            "\u2c60": "L",
                            "\ua748": "L",
                            "\ua746": "L",
                            "\ua780": "L",
                            "\u01c7": "LJ",
                            "\u01c8": "Lj",
                            "\u24c2": "M",
                            "\uff2d": "M",
                            "\u1e3e": "M",
                            "\u1e40": "M",
                            "\u1e42": "M",
                            "\u2c6e": "M",
                            "\u019c": "M",
                            "\u24c3": "N",
                            "\uff2e": "N",
                            "\u01f8": "N",
                            "\u0143": "N",
                            "\xd1": "N",
                            "\u1e44": "N",
                            "\u0147": "N",
                            "\u1e46": "N",
                            "\u0145": "N",
                            "\u1e4a": "N",
                            "\u1e48": "N",
                            "\u0220": "N",
                            "\u019d": "N",
                            "\ua790": "N",
                            "\ua7a4": "N",
                            "\u01ca": "NJ",
                            "\u01cb": "Nj",
                            "\u24c4": "O",
                            "\uff2f": "O",
                            "\xd2": "O",
                            "\xd3": "O",
                            "\xd4": "O",
                            "\u1ed2": "O",
                            "\u1ed0": "O",
                            "\u1ed6": "O",
                            "\u1ed4": "O",
                            "\xd5": "O",
                            "\u1e4c": "O",
                            "\u022c": "O",
                            "\u1e4e": "O",
                            "\u014c": "O",
                            "\u1e50": "O",
                            "\u1e52": "O",
                            "\u014e": "O",
                            "\u022e": "O",
                            "\u0230": "O",
                            "\xd6": "O",
                            "\u022a": "O",
                            "\u1ece": "O",
                            "\u0150": "O",
                            "\u01d1": "O",
                            "\u020c": "O",
                            "\u020e": "O",
                            "\u01a0": "O",
                            "\u1edc": "O",
                            "\u1eda": "O",
                            "\u1ee0": "O",
                            "\u1ede": "O",
                            "\u1ee2": "O",
                            "\u1ecc": "O",
                            "\u1ed8": "O",
                            "\u01ea": "O",
                            "\u01ec": "O",
                            "\xd8": "O",
                            "\u01fe": "O",
                            "\u0186": "O",
                            "\u019f": "O",
                            "\ua74a": "O",
                            "\ua74c": "O",
                            "\u01a2": "OI",
                            "\ua74e": "OO",
                            "\u0222": "OU",
                            "\u24c5": "P",
                            "\uff30": "P",
                            "\u1e54": "P",
                            "\u1e56": "P",
                            "\u01a4": "P",
                            "\u2c63": "P",
                            "\ua750": "P",
                            "\ua752": "P",
                            "\ua754": "P",
                            "\u24c6": "Q",
                            "\uff31": "Q",
                            "\ua756": "Q",
                            "\ua758": "Q",
                            "\u024a": "Q",
                            "\u24c7": "R",
                            "\uff32": "R",
                            "\u0154": "R",
                            "\u1e58": "R",
                            "\u0158": "R",
                            "\u0210": "R",
                            "\u0212": "R",
                            "\u1e5a": "R",
                            "\u1e5c": "R",
                            "\u0156": "R",
                            "\u1e5e": "R",
                            "\u024c": "R",
                            "\u2c64": "R",
                            "\ua75a": "R",
                            "\ua7a6": "R",
                            "\ua782": "R",
                            "\u24c8": "S",
                            "\uff33": "S",
                            "\u1e9e": "S",
                            "\u015a": "S",
                            "\u1e64": "S",
                            "\u015c": "S",
                            "\u1e60": "S",
                            "\u0160": "S",
                            "\u1e66": "S",
                            "\u1e62": "S",
                            "\u1e68": "S",
                            "\u0218": "S",
                            "\u015e": "S",
                            "\u2c7e": "S",
                            "\ua7a8": "S",
                            "\ua784": "S",
                            "\u24c9": "T",
                            "\uff34": "T",
                            "\u1e6a": "T",
                            "\u0164": "T",
                            "\u1e6c": "T",
                            "\u021a": "T",
                            "\u0162": "T",
                            "\u1e70": "T",
                            "\u1e6e": "T",
                            "\u0166": "T",
                            "\u01ac": "T",
                            "\u01ae": "T",
                            "\u023e": "T",
                            "\ua786": "T",
                            "\ua728": "TZ",
                            "\u24ca": "U",
                            "\uff35": "U",
                            "\xd9": "U",
                            "\xda": "U",
                            "\xdb": "U",
                            "\u0168": "U",
                            "\u1e78": "U",
                            "\u016a": "U",
                            "\u1e7a": "U",
                            "\u016c": "U",
                            "\xdc": "U",
                            "\u01db": "U",
                            "\u01d7": "U",
                            "\u01d5": "U",
                            "\u01d9": "U",
                            "\u1ee6": "U",
                            "\u016e": "U",
                            "\u0170": "U",
                            "\u01d3": "U",
                            "\u0214": "U",
                            "\u0216": "U",
                            "\u01af": "U",
                            "\u1eea": "U",
                            "\u1ee8": "U",
                            "\u1eee": "U",
                            "\u1eec": "U",
                            "\u1ef0": "U",
                            "\u1ee4": "U",
                            "\u1e72": "U",
                            "\u0172": "U",
                            "\u1e76": "U",
                            "\u1e74": "U",
                            "\u0244": "U",
                            "\u24cb": "V",
                            "\uff36": "V",
                            "\u1e7c": "V",
                            "\u1e7e": "V",
                            "\u01b2": "V",
                            "\ua75e": "V",
                            "\u0245": "V",
                            "\ua760": "VY",
                            "\u24cc": "W",
                            "\uff37": "W",
                            "\u1e80": "W",
                            "\u1e82": "W",
                            "\u0174": "W",
                            "\u1e86": "W",
                            "\u1e84": "W",
                            "\u1e88": "W",
                            "\u2c72": "W",
                            "\u24cd": "X",
                            "\uff38": "X",
                            "\u1e8a": "X",
                            "\u1e8c": "X",
                            "\u24ce": "Y",
                            "\uff39": "Y",
                            "\u1ef2": "Y",
                            "\xdd": "Y",
                            "\u0176": "Y",
                            "\u1ef8": "Y",
                            "\u0232": "Y",
                            "\u1e8e": "Y",
                            "\u0178": "Y",
                            "\u1ef6": "Y",
                            "\u1ef4": "Y",
                            "\u01b3": "Y",
                            "\u024e": "Y",
                            "\u1efe": "Y",
                            "\u24cf": "Z",
                            "\uff3a": "Z",
                            "\u0179": "Z",
                            "\u1e90": "Z",
                            "\u017b": "Z",
                            "\u017d": "Z",
                            "\u1e92": "Z",
                            "\u1e94": "Z",
                            "\u01b5": "Z",
                            "\u0224": "Z",
                            "\u2c7f": "Z",
                            "\u2c6b": "Z",
                            "\ua762": "Z",
                            "\u24d0": "a",
                            "\uff41": "a",
                            "\u1e9a": "a",
                            "\xe0": "a",
                            "\xe1": "a",
                            "\xe2": "a",
                            "\u1ea7": "a",
                            "\u1ea5": "a",
                            "\u1eab": "a",
                            "\u1ea9": "a",
                            "\xe3": "a",
                            "\u0101": "a",
                            "\u0103": "a",
                            "\u1eb1": "a",
                            "\u1eaf": "a",
                            "\u1eb5": "a",
                            "\u1eb3": "a",
                            "\u0227": "a",
                            "\u01e1": "a",
                            "\xe4": "a",
                            "\u01df": "a",
                            "\u1ea3": "a",
                            "\xe5": "a",
                            "\u01fb": "a",
                            "\u01ce": "a",
                            "\u0201": "a",
                            "\u0203": "a",
                            "\u1ea1": "a",
                            "\u1ead": "a",
                            "\u1eb7": "a",
                            "\u1e01": "a",
                            "\u0105": "a",
                            "\u2c65": "a",
                            "\u0250": "a",
                            "\ua733": "aa",
                            "\xe6": "ae",
                            "\u01fd": "ae",
                            "\u01e3": "ae",
                            "\ua735": "ao",
                            "\ua737": "au",
                            "\ua739": "av",
                            "\ua73b": "av",
                            "\ua73d": "ay",
                            "\u24d1": "b",
                            "\uff42": "b",
                            "\u1e03": "b",
                            "\u1e05": "b",
                            "\u1e07": "b",
                            "\u0180": "b",
                            "\u0183": "b",
                            "\u0253": "b",
                            "\u24d2": "c",
                            "\uff43": "c",
                            "\u0107": "c",
                            "\u0109": "c",
                            "\u010b": "c",
                            "\u010d": "c",
                            "\xe7": "c",
                            "\u1e09": "c",
                            "\u0188": "c",
                            "\u023c": "c",
                            "\ua73f": "c",
                            "\u2184": "c",
                            "\u24d3": "d",
                            "\uff44": "d",
                            "\u1e0b": "d",
                            "\u010f": "d",
                            "\u1e0d": "d",
                            "\u1e11": "d",
                            "\u1e13": "d",
                            "\u1e0f": "d",
                            "\u0111": "d",
                            "\u018c": "d",
                            "\u0256": "d",
                            "\u0257": "d",
                            "\ua77a": "d",
                            "\u01f3": "dz",
                            "\u01c6": "dz",
                            "\u24d4": "e",
                            "\uff45": "e",
                            "\xe8": "e",
                            "\xe9": "e",
                            "\xea": "e",
                            "\u1ec1": "e",
                            "\u1ebf": "e",
                            "\u1ec5": "e",
                            "\u1ec3": "e",
                            "\u1ebd": "e",
                            "\u0113": "e",
                            "\u1e15": "e",
                            "\u1e17": "e",
                            "\u0115": "e",
                            "\u0117": "e",
                            "\xeb": "e",
                            "\u1ebb": "e",
                            "\u011b": "e",
                            "\u0205": "e",
                            "\u0207": "e",
                            "\u1eb9": "e",
                            "\u1ec7": "e",
                            "\u0229": "e",
                            "\u1e1d": "e",
                            "\u0119": "e",
                            "\u1e19": "e",
                            "\u1e1b": "e",
                            "\u0247": "e",
                            "\u025b": "e",
                            "\u01dd": "e",
                            "\u24d5": "f",
                            "\uff46": "f",
                            "\u1e1f": "f",
                            "\u0192": "f",
                            "\ua77c": "f",
                            "\u24d6": "g",
                            "\uff47": "g",
                            "\u01f5": "g",
                            "\u011d": "g",
                            "\u1e21": "g",
                            "\u011f": "g",
                            "\u0121": "g",
                            "\u01e7": "g",
                            "\u0123": "g",
                            "\u01e5": "g",
                            "\u0260": "g",
                            "\ua7a1": "g",
                            "\u1d79": "g",
                            "\ua77f": "g",
                            "\u24d7": "h",
                            "\uff48": "h",
                            "\u0125": "h",
                            "\u1e23": "h",
                            "\u1e27": "h",
                            "\u021f": "h",
                            "\u1e25": "h",
                            "\u1e29": "h",
                            "\u1e2b": "h",
                            "\u1e96": "h",
                            "\u0127": "h",
                            "\u2c68": "h",
                            "\u2c76": "h",
                            "\u0265": "h",
                            "\u0195": "hv",
                            "\u24d8": "i",
                            "\uff49": "i",
                            "\xec": "i",
                            "\xed": "i",
                            "\xee": "i",
                            "\u0129": "i",
                            "\u012b": "i",
                            "\u012d": "i",
                            "\xef": "i",
                            "\u1e2f": "i",
                            "\u1ec9": "i",
                            "\u01d0": "i",
                            "\u0209": "i",
                            "\u020b": "i",
                            "\u1ecb": "i",
                            "\u012f": "i",
                            "\u1e2d": "i",
                            "\u0268": "i",
                            "\u0131": "i",
                            "\u24d9": "j",
                            "\uff4a": "j",
                            "\u0135": "j",
                            "\u01f0": "j",
                            "\u0249": "j",
                            "\u24da": "k",
                            "\uff4b": "k",
                            "\u1e31": "k",
                            "\u01e9": "k",
                            "\u1e33": "k",
                            "\u0137": "k",
                            "\u1e35": "k",
                            "\u0199": "k",
                            "\u2c6a": "k",
                            "\ua741": "k",
                            "\ua743": "k",
                            "\ua745": "k",
                            "\ua7a3": "k",
                            "\u24db": "l",
                            "\uff4c": "l",
                            "\u0140": "l",
                            "\u013a": "l",
                            "\u013e": "l",
                            "\u1e37": "l",
                            "\u1e39": "l",
                            "\u013c": "l",
                            "\u1e3d": "l",
                            "\u1e3b": "l",
                            "\u017f": "l",
                            "\u0142": "l",
                            "\u019a": "l",
                            "\u026b": "l",
                            "\u2c61": "l",
                            "\ua749": "l",
                            "\ua781": "l",
                            "\ua747": "l",
                            "\u01c9": "lj",
                            "\u24dc": "m",
                            "\uff4d": "m",
                            "\u1e3f": "m",
                            "\u1e41": "m",
                            "\u1e43": "m",
                            "\u0271": "m",
                            "\u026f": "m",
                            "\u24dd": "n",
                            "\uff4e": "n",
                            "\u01f9": "n",
                            "\u0144": "n",
                            "\xf1": "n",
                            "\u1e45": "n",
                            "\u0148": "n",
                            "\u1e47": "n",
                            "\u0146": "n",
                            "\u1e4b": "n",
                            "\u1e49": "n",
                            "\u019e": "n",
                            "\u0272": "n",
                            "\u0149": "n",
                            "\ua791": "n",
                            "\ua7a5": "n",
                            "\u01cc": "nj",
                            "\u24de": "o",
                            "\uff4f": "o",
                            "\xf2": "o",
                            "\xf3": "o",
                            "\xf4": "o",
                            "\u1ed3": "o",
                            "\u1ed1": "o",
                            "\u1ed7": "o",
                            "\u1ed5": "o",
                            "\xf5": "o",
                            "\u1e4d": "o",
                            "\u022d": "o",
                            "\u1e4f": "o",
                            "\u014d": "o",
                            "\u1e51": "o",
                            "\u1e53": "o",
                            "\u014f": "o",
                            "\u022f": "o",
                            "\u0231": "o",
                            "\xf6": "o",
                            "\u022b": "o",
                            "\u1ecf": "o",
                            "\u0151": "o",
                            "\u01d2": "o",
                            "\u020d": "o",
                            "\u020f": "o",
                            "\u01a1": "o",
                            "\u1edd": "o",
                            "\u1edb": "o",
                            "\u1ee1": "o",
                            "\u1edf": "o",
                            "\u1ee3": "o",
                            "\u1ecd": "o",
                            "\u1ed9": "o",
                            "\u01eb": "o",
                            "\u01ed": "o",
                            "\xf8": "o",
                            "\u01ff": "o",
                            "\u0254": "o",
                            "\ua74b": "o",
                            "\ua74d": "o",
                            "\u0275": "o",
                            "\u01a3": "oi",
                            "\u0223": "ou",
                            "\ua74f": "oo",
                            "\u24df": "p",
                            "\uff50": "p",
                            "\u1e55": "p",
                            "\u1e57": "p",
                            "\u01a5": "p",
                            "\u1d7d": "p",
                            "\ua751": "p",
                            "\ua753": "p",
                            "\ua755": "p",
                            "\u24e0": "q",
                            "\uff51": "q",
                            "\u024b": "q",
                            "\ua757": "q",
                            "\ua759": "q",
                            "\u24e1": "r",
                            "\uff52": "r",
                            "\u0155": "r",
                            "\u1e59": "r",
                            "\u0159": "r",
                            "\u0211": "r",
                            "\u0213": "r",
                            "\u1e5b": "r",
                            "\u1e5d": "r",
                            "\u0157": "r",
                            "\u1e5f": "r",
                            "\u024d": "r",
                            "\u027d": "r",
                            "\ua75b": "r",
                            "\ua7a7": "r",
                            "\ua783": "r",
                            "\u24e2": "s",
                            "\uff53": "s",
                            "\xdf": "s",
                            "\u015b": "s",
                            "\u1e65": "s",
                            "\u015d": "s",
                            "\u1e61": "s",
                            "\u0161": "s",
                            "\u1e67": "s",
                            "\u1e63": "s",
                            "\u1e69": "s",
                            "\u0219": "s",
                            "\u015f": "s",
                            "\u023f": "s",
                            "\ua7a9": "s",
                            "\ua785": "s",
                            "\u1e9b": "s",
                            "\u24e3": "t",
                            "\uff54": "t",
                            "\u1e6b": "t",
                            "\u1e97": "t",
                            "\u0165": "t",
                            "\u1e6d": "t",
                            "\u021b": "t",
                            "\u0163": "t",
                            "\u1e71": "t",
                            "\u1e6f": "t",
                            "\u0167": "t",
                            "\u01ad": "t",
                            "\u0288": "t",
                            "\u2c66": "t",
                            "\ua787": "t",
                            "\ua729": "tz",
                            "\u24e4": "u",
                            "\uff55": "u",
                            "\xf9": "u",
                            "\xfa": "u",
                            "\xfb": "u",
                            "\u0169": "u",
                            "\u1e79": "u",
                            "\u016b": "u",
                            "\u1e7b": "u",
                            "\u016d": "u",
                            "\xfc": "u",
                            "\u01dc": "u",
                            "\u01d8": "u",
                            "\u01d6": "u",
                            "\u01da": "u",
                            "\u1ee7": "u",
                            "\u016f": "u",
                            "\u0171": "u",
                            "\u01d4": "u",
                            "\u0215": "u",
                            "\u0217": "u",
                            "\u01b0": "u",
                            "\u1eeb": "u",
                            "\u1ee9": "u",
                            "\u1eef": "u",
                            "\u1eed": "u",
                            "\u1ef1": "u",
                            "\u1ee5": "u",
                            "\u1e73": "u",
                            "\u0173": "u",
                            "\u1e77": "u",
                            "\u1e75": "u",
                            "\u0289": "u",
                            "\u24e5": "v",
                            "\uff56": "v",
                            "\u1e7d": "v",
                            "\u1e7f": "v",
                            "\u028b": "v",
                            "\ua75f": "v",
                            "\u028c": "v",
                            "\ua761": "vy",
                            "\u24e6": "w",
                            "\uff57": "w",
                            "\u1e81": "w",
                            "\u1e83": "w",
                            "\u0175": "w",
                            "\u1e87": "w",
                            "\u1e85": "w",
                            "\u1e98": "w",
                            "\u1e89": "w",
                            "\u2c73": "w",
                            "\u24e7": "x",
                            "\uff58": "x",
                            "\u1e8b": "x",
                            "\u1e8d": "x",
                            "\u24e8": "y",
                            "\uff59": "y",
                            "\u1ef3": "y",
                            "\xfd": "y",
                            "\u0177": "y",
                            "\u1ef9": "y",
                            "\u0233": "y",
                            "\u1e8f": "y",
                            "\xff": "y",
                            "\u1ef7": "y",
                            "\u1e99": "y",
                            "\u1ef5": "y",
                            "\u01b4": "y",
                            "\u024f": "y",
                            "\u1eff": "y",
                            "\u24e9": "z",
                            "\uff5a": "z",
                            "\u017a": "z",
                            "\u1e91": "z",
                            "\u017c": "z",
                            "\u017e": "z",
                            "\u1e93": "z",
                            "\u1e95": "z",
                            "\u01b6": "z",
                            "\u0225": "z",
                            "\u0240": "z",
                            "\u2c6c": "z",
                            "\ua763": "z",
                            "\u0386": "\u0391",
                            "\u0388": "\u0395",
                            "\u0389": "\u0397",
                            "\u038a": "\u0399",
                            "\u03aa": "\u0399",
                            "\u038c": "\u039f",
                            "\u038e": "\u03a5",
                            "\u03ab": "\u03a5",
                            "\u038f": "\u03a9",
                            "\u03ac": "\u03b1",
                            "\u03ad": "\u03b5",
                            "\u03ae": "\u03b7",
                            "\u03af": "\u03b9",
                            "\u03ca": "\u03b9",
                            "\u0390": "\u03b9",
                            "\u03cc": "\u03bf",
                            "\u03cd": "\u03c5",
                            "\u03cb": "\u03c5",
                            "\u03b0": "\u03c5",
                            "\u03c9": "\u03c9",
                            "\u03c2": "\u03c3"
                        };
                        return e
                    }), t.define("select2/data/base", ["../utils"], function (e) {
                        function t(e, n) {
                            t.__super__.constructor.call(this)
                        }
                        return e.Extend(t, e.Observable), t.prototype.current = function (e) {
                            throw new Error("The `current` method must be defined in child classes.")
                        }, t.prototype.query = function (e, t) {
                            throw new Error("The `query` method must be defined in child classes.")
                        }, t.prototype.bind = function (e, t) {}, t.prototype.destroy = function () {}, t.prototype.generateResultId = function (t, n) {
                            var i = t.id + "-result-";
                            return i += e.generateChars(4), i += null != n.id ? "-" + n.id.toString() : "-" + e.generateChars(4)
                        }, t
                    }), t.define("select2/data/select", ["./base", "../utils", "jquery"], function (e, t, n) {
                        function i(e, t) {
                            this.$element = e, this.options = t, i.__super__.constructor.call(this)
                        }
                        return t.Extend(i, e), i.prototype.current = function (e) {
                            var t = [],
                                i = this;
                            this.$element.find(":selected")
                                .each(function () {
                                    var e = n(this),
                                        r = i.item(e);
                                    t.push(r)
                                }), e(t)
                        }, i.prototype.select = function (e) {
                            var t = this;
                            if (e.selected = !0, n(e.element)
                                .is("option")) return e.element.selected = !0, void this.$element.trigger("change");
                            if (this.$element.prop("multiple")) this.current(function (i) {
                                var r = [];
                                e = [e], e.push.apply(e, i);
                                for (var o = 0; o < e.length; o++) {
                                    var s = e[o].id; - 1 === n.inArray(s, r) && r.push(s)
                                }
                                t.$element.val(r), t.$element.trigger("change")
                            });
                            else {
                                var i = e.id;
                                this.$element.val(i), this.$element.trigger("change")
                            }
                        }, i.prototype.unselect = function (e) {
                            var t = this;
                            return this.$element.prop("multiple") ? (e.selected = !1, n(e.element)
                                .is("option") ? (e.element.selected = !1, void this.$element.trigger("change")) : void this.current(function (i) {
                                    for (var r = [], o = 0; o < i.length; o++) {
                                        var s = i[o].id;
                                        s !== e.id && -1 === n.inArray(s, r) && r.push(s)
                                    }
                                    t.$element.val(r), t.$element.trigger("change")
                                })) : void 0
                        }, i.prototype.bind = function (e, t) {
                            var n = this;
                            this.container = e, e.on("select", function (e) {
                                n.select(e.data)
                            }), e.on("unselect", function (e) {
                                n.unselect(e.data)
                            })
                        }, i.prototype.destroy = function () {
                            this.$element.find("*")
                                .each(function () {
                                    n.removeData(this, "data")
                                })
                        }, i.prototype.query = function (e, t) {
                            var i = [],
                                r = this,
                                o = this.$element.children();
                            o.each(function () {
                                var t = n(this);
                                if (t.is("option") || t.is("optgroup")) {
                                    var o = r.item(t),
                                        s = r.matches(e, o);
                                    null !== s && i.push(s)
                                }
                            }), t({
                                results: i
                            })
                        }, i.prototype.addOptions = function (e) {
                            t.appendMany(this.$element, e)
                        }, i.prototype.option = function (e) {
                            var t;
                            e.children ? (t = document.createElement("optgroup"), t.label = e.text) : (t = document.createElement("option"), void 0 !== t.textContent ? t.textContent = e.text : t.innerText = e.text), e.id && (t.value = e.id), e.disabled && (t.disabled = !0), e.selected && (t.selected = !0), e.title && (t.title = e.title);
                            var i = n(t),
                                r = this._normalizeItem(e);
                            return r.element = t, n.data(t, "data", r), i
                        }, i.prototype.item = function (e) {
                            var t = {};
                            if (t = n.data(e[0], "data"), null != t) return t;
                            if (e.is("option")) t = {
                                id: e.val(),
                                text: e.text(),
                                disabled: e.prop("disabled"),
                                selected: e.prop("selected"),
                                title: e.prop("title")
                            };
                            else if (e.is("optgroup")) {
                                t = {
                                    text: e.prop("label"),
                                    children: [],
                                    title: e.prop("title")
                                };
                                for (var i = e.children("option"), r = [], o = 0; o < i.length; o++) {
                                    var s = n(i[o]),
                                        a = this.item(s);
                                    r.push(a)
                                }
                                t.children = r
                            }
                            return t = this._normalizeItem(t), t.element = e[0], n.data(e[0], "data", t), t
                        }, i.prototype._normalizeItem = function (e) {
                            n.isPlainObject(e) || (e = {
                                id: e,
                                text: e
                            }), e = n.extend({}, {
                                text: ""
                            }, e);
                            var t = {
                                selected: !1,
                                disabled: !1
                            };
                            return null != e.id && (e.id = e.id.toString()), null != e.text && (e.text = e.text.toString()), null == e._resultId && e.id && null != this.container && (e._resultId = this.generateResultId(this.container, e)), n.extend({}, t, e)
                        }, i.prototype.matches = function (e, t) {
                            var n = this.options.get("matcher");
                            return n(e, t)
                        }, i
                    }), t.define("select2/data/array", ["./select", "../utils", "jquery"], function (e, t, n) {
                        function i(e, t) {
                            var n = t.get("data") || [];
                            i.__super__.constructor.call(this, e, t), this.addOptions(this.convertToOptions(n))
                        }
                        return t.Extend(i, e), i.prototype.select = function (e) {
                            var t = this.$element.find("option")
                                .filter(function (t, n) {
                                    return n.value == e.id.toString()
                                });
                            0 === t.length && (t = this.option(e), this.addOptions(t)), i.__super__.select.call(this, e)
                        }, i.prototype.convertToOptions = function (e) {
                            function i(e) {
                                return function () {
                                    return n(this)
                                        .val() == e.id
                                }
                            }
                            for (var r = this, o = this.$element.find("option"), s = o.map(function () {
                                        return r.item(n(this))
                                            .id
                                    })
                                    .get(), a = [], l = 0; l < e.length; l++) {
                                var c = this._normalizeItem(e[l]);
                                if (n.inArray(c.id, s) >= 0) {
                                    var u = o.filter(i(c)),
                                        d = this.item(u),
                                        p = n.extend(!0, {}, c, d),
                                        f = this.option(p);
                                    u.replaceWith(f)
                                } else {
                                    var h = this.option(c);
                                    if (c.children) {
                                        var g = this.convertToOptions(c.children);
                                        t.appendMany(h, g)
                                    }
                                    a.push(h)
                                }
                            }
                            return a
                        }, i
                    }), t.define("select2/data/ajax", ["./array", "../utils", "jquery"], function (e, t, n) {
                        function i(e, t) {
                            this.ajaxOptions = this._applyDefaults(t.get("ajax")), null != this.ajaxOptions.processResults && (this.processResults = this.ajaxOptions.processResults), i.__super__.constructor.call(this, e, t)
                        }
                        return t.Extend(i, e), i.prototype._applyDefaults = function (e) {
                            var t = {
                                data: function (e) {
                                    return n.extend({}, e, {
                                        q: e.term
                                    })
                                },
                                transport: function (e, t, i) {
                                    var r = n.ajax(e);
                                    return r.then(t), r.fail(i), r
                                }
                            };
                            return n.extend({}, t, e, !0)
                        }, i.prototype.processResults = function (e) {
                            return e
                        }, i.prototype.query = function (e, t) {
                            function i() {
                                var i = o.transport(o, function (i) {
                                    var o = r.processResults(i, e);
                                    r.options.get("debug") && window.console && console.error && (o && o.results && n.isArray(o.results) || console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")), t(o)
                                }, function () {
                                    r.trigger("results:message", {
                                        message: "errorLoading"
                                    })
                                });
                                r._request = i
                            }
                            var r = this;
                            null != this._request && (n.isFunction(this._request.abort) && this._request.abort(), this._request = null);
                            var o = n.extend({
                                type: "GET"
                            }, this.ajaxOptions);
                            "function" == typeof o.url && (o.url = o.url.call(this.$element, e)), "function" == typeof o.data && (o.data = o.data.call(this.$element, e)), this.ajaxOptions.delay && "" !== e.term ? (this._queryTimeout && window.clearTimeout(this._queryTimeout), this._queryTimeout = window.setTimeout(i, this.ajaxOptions.delay)) : i()
                        }, i
                    }), t.define("select2/data/tags", ["jquery"], function (e) {
                        function t(t, n, i) {
                            var r = i.get("tags"),
                                o = i.get("createTag");
                            void 0 !== o && (this.createTag = o);
                            var s = i.get("insertTag");
                            if (void 0 !== s && (this.insertTag = s), t.call(this, n, i), e.isArray(r))
                                for (var a = 0; a < r.length; a++) {
                                    var l = r[a],
                                        c = this._normalizeItem(l),
                                        u = this.option(c);
                                    this.$element.append(u)
                                }
                        }
                        return t.prototype.query = function (e, t, n) {
                            function i(e, o) {
                                for (var s = e.results, a = 0; a < s.length; a++) {
                                    var l = s[a],
                                        c = null != l.children && !i({
                                            results: l.children
                                        }, !0),
                                        u = l.text === t.term;
                                    if (u || c) return o ? !1 : (e.data = s, void n(e))
                                }
                                if (o) return !0;
                                var d = r.createTag(t);
                                if (null != d) {
                                    var p = r.option(d);
                                    p.attr("data-select2-tag", !0), r.addOptions([p]), r.insertTag(s, d)
                                }
                                e.results = s, n(e)
                            }
                            var r = this;
                            return this._removeOldTags(), null == t.term || null != t.page ? void e.call(this, t, n) : void e.call(this, t, i)
                        }, t.prototype.createTag = function (t, n) {
                            var i = e.trim(n.term);
                            return "" === i ? null : {
                                id: i,
                                text: i
                            }
                        }, t.prototype.insertTag = function (e, t, n) {
                            t.unshift(n)
                        }, t.prototype._removeOldTags = function (t) {
                            var n = (this._lastTag, this.$element.find("option[data-select2-tag]"));
                            n.each(function () {
                                this.selected || e(this)
                                    .remove()
                            })
                        }, t
                    }), t.define("select2/data/tokenizer", ["jquery"], function (e) {
                        function t(e, t, n) {
                            var i = n.get("tokenizer");
                            void 0 !== i && (this.tokenizer = i), e.call(this, t, n)
                        }
                        return t.prototype.bind = function (e, t, n) {
                            e.call(this, t, n), this.$search = t.dropdown.$search || t.selection.$search || n.find(".select2-search__field")
                        }, t.prototype.query = function (e, t, n) {
                            function i(e) {
                                r.trigger("select", {
                                    data: e
                                })
                            }
                            var r = this;
                            t.term = t.term || "";
                            var o = this.tokenizer(t, this.options, i);
                            o.term !== t.term && (this.$search.length && (this.$search.val(o.term), this.$search.focus()), t.term = o.term), e.call(this, t, n)
                        }, t.prototype.tokenizer = function (t, n, i, r) {
                            for (var o = i.get("tokenSeparators") || [], s = n.term, a = 0, l = this.createTag || function (e) {
                                    return {
                                        id: e.term,
                                        text: e.term
                                    }
                                }; a < s.length;) {
                                var c = s[a];
                                if (-1 !== e.inArray(c, o)) {
                                    var u = s.substr(0, a),
                                        d = e.extend({}, n, {
                                            term: u
                                        }),
                                        p = l(d);
                                    null != p ? (r(p), s = s.substr(a + 1) || "", a = 0) : a++
                                } else a++
                            }
                            return {
                                term: s
                            }
                        }, t
                    }), t.define("select2/data/minimumInputLength", [], function () {
                        function e(e, t, n) {
                            this.minimumInputLength = n.get("minimumInputLength"), e.call(this, t, n)
                        }
                        return e.prototype.query = function (e, t, n) {
                            return t.term = t.term || "", t.term.length < this.minimumInputLength ? void this.trigger("results:message", {
                                message: "inputTooShort",
                                args: {
                                    minimum: this.minimumInputLength,
                                    input: t.term,
                                    params: t
                                }
                            }) : void e.call(this, t, n)
                        }, e
                    }), t.define("select2/data/maximumInputLength", [], function () {
                        function e(e, t, n) {
                            this.maximumInputLength = n.get("maximumInputLength"), e.call(this, t, n)
                        }
                        return e.prototype.query = function (e, t, n) {
                            return t.term = t.term || "", this.maximumInputLength > 0 && t.term.length > this.maximumInputLength ? void this.trigger("results:message", {
                                message: "inputTooLong",
                                args: {
                                    maximum: this.maximumInputLength,
                                    input: t.term,
                                    params: t
                                }
                            }) : void e.call(this, t, n)
                        }, e
                    }), t.define("select2/data/maximumSelectionLength", [], function () {
                        function e(e, t, n) {
                            this.maximumSelectionLength = n.get("maximumSelectionLength"), e.call(this, t, n)
                        }
                        return e.prototype.query = function (e, t, n) {
                            var i = this;
                            this.current(function (r) {
                                var o = null != r ? r.length : 0;
                                return i.maximumSelectionLength > 0 && o >= i.maximumSelectionLength ? void i.trigger("results:message", {
                                    message: "maximumSelected",
                                    args: {
                                        maximum: i.maximumSelectionLength
                                    }
                                }) : void e.call(i, t, n)
                            })
                        }, e
                    }), t.define("select2/dropdown", ["jquery", "./utils"], function (e, t) {
                        function n(e, t) {
                            this.$element = e, this.options = t, n.__super__.constructor.call(this)
                        }
                        return t.Extend(n, t.Observable), n.prototype.render = function () {
                            var t = e('<span class="select2-dropdown"><span class="select2-results"></span></span>');
                            return t.attr("dir", this.options.get("dir")), this.$dropdown = t, t
                        }, n.prototype.bind = function () {}, n.prototype.position = function (e, t) {}, n.prototype.destroy = function () {
                            this.$dropdown.remove()
                        }, n
                    }), t.define("select2/dropdown/search", ["jquery", "../utils"], function (e, t) {
                        function n() {}
                        return n.prototype.render = function (t) {
                            var n = t.call(this),
                                i = e('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');
                            return this.$searchContainer = i, this.$search = i.find("input"), n.prepend(i), n
                        }, n.prototype.bind = function (t, n, i) {
                            var r = this;
                            t.call(this, n, i), this.$search.on("keydown", function (e) {
                                r.trigger("keypress", e), r._keyUpPrevented = e.isDefaultPrevented()
                            }), this.$search.on("input", function (t) {
                                e(this)
                                    .off("keyup")
                            }), this.$search.on("keyup input", function (e) {
                                r.handleSearch(e)
                            }), n.on("open", function () {
                                r.$search.attr("tabindex", 0), r.$search.focus(), window.setTimeout(function () {
                                    r.$search.focus()
                                }, 0)
                            }), n.on("close", function () {
                                r.$search.attr("tabindex", -1), r.$search.val("")
                            }), n.on("results:all", function (e) {
                                if (null == e.query.term || "" === e.query.term) {
                                    var t = r.showSearch(e);
                                    t ? r.$searchContainer.removeClass("select2-search--hide") : r.$searchContainer.addClass("select2-search--hide")
                                }
                            })
                        }, n.prototype.handleSearch = function (e) {
                            if (!this._keyUpPrevented) {
                                var t = this.$search.val();
                                this.trigger("query", {
                                    term: t
                                })
                            }
                            this._keyUpPrevented = !1
                        }, n.prototype.showSearch = function (e, t) {
                            return !0
                        }, n
                    }), t.define("select2/dropdown/hidePlaceholder", [], function () {
                        function e(e, t, n, i) {
                            this.placeholder = this.normalizePlaceholder(n.get("placeholder")), e.call(this, t, n, i)
                        }
                        return e.prototype.append = function (e, t) {
                            t.results = this.removePlaceholder(t.results), e.call(this, t)
                        }, e.prototype.normalizePlaceholder = function (e, t) {
                            return "string" == typeof t && (t = {
                                id: "",
                                text: t
                            }), t
                        }, e.prototype.removePlaceholder = function (e, t) {
                            for (var n = t.slice(0), i = t.length - 1; i >= 0; i--) {
                                var r = t[i];
                                this.placeholder.id === r.id && n.splice(i, 1)
                            }
                            return n
                        }, e
                    }), t.define("select2/dropdown/infiniteScroll", ["jquery"], function (e) {
                        function t(e, t, n, i) {
                            this.lastParams = {}, e.call(this, t, n, i), this.$loadingMore = this.createLoadingMore(), this.loading = !1
                        }
                        return t.prototype.append = function (e, t) {
                            this.$loadingMore.remove(), this.loading = !1, e.call(this, t), this.showLoadingMore(t) && this.$results.append(this.$loadingMore)
                        }, t.prototype.bind = function (t, n, i) {
                            var r = this;
                            t.call(this, n, i), n.on("query", function (e) {
                                r.lastParams = e, r.loading = !0
                            }), n.on("query:append", function (e) {
                                r.lastParams = e, r.loading = !0
                            }), this.$results.on("scroll", function () {
                                var t = e.contains(document.documentElement, r.$loadingMore[0]);
                                if (!r.loading && t) {
                                    var n = r.$results.offset()
                                        .top + r.$results.outerHeight(!1),
                                        i = r.$loadingMore.offset()
                                        .top + r.$loadingMore.outerHeight(!1);
                                    n + 50 >= i && r.loadMore()
                                }
                            })
                        }, t.prototype.loadMore = function () {
                            this.loading = !0;
                            var t = e.extend({}, {
                                page: 1
                            }, this.lastParams);
                            t.page++, this.trigger("query:append", t)
                        }, t.prototype.showLoadingMore = function (e, t) {
                            return t.pagination && t.pagination.more
                        }, t.prototype.createLoadingMore = function () {
                            var t = e('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),
                                n = this.options.get("translations")
                                .get("loadingMore");
                            return t.html(n(this.lastParams)), t
                        }, t
                    }), t.define("select2/dropdown/attachBody", ["jquery", "../utils"], function (e, t) {
                        function n(t, n, i) {
                            this.$dropdownParent = i.get("dropdownParent") || e(document.body), t.call(this, n, i)
                        }
                        return n.prototype.bind = function (e, t, n) {
                            var i = this,
                                r = !1;
                            e.call(this, t, n), t.on("open", function () {
                                i._showDropdown(), i._attachPositioningHandler(t), r || (r = !0, t.on("results:all", function () {
                                    i._positionDropdown(), i._resizeDropdown()
                                }), t.on("results:append", function () {
                                    i._positionDropdown(), i._resizeDropdown()
                                }))
                            }), t.on("close", function () {
                                i._hideDropdown(), i._detachPositioningHandler(t)
                            }), this.$dropdownContainer.on("mousedown", function (e) {
                                e.stopPropagation()
                            })
                        }, n.prototype.destroy = function (e) {
                            e.call(this), this.$dropdownContainer.remove()
                        }, n.prototype.position = function (e, t, n) {
                            t.attr("class", n.attr("class")), t.removeClass("select2"), t.addClass("select2-container--open"), t.css({
                                position: "absolute",
                                top: -999999
                            }), this.$container = n
                        }, n.prototype.render = function (t) {
                            var n = e("<span></span>"),
                                i = t.call(this);
                            return n.append(i), this.$dropdownContainer = n, n
                        }, n.prototype._hideDropdown = function (e) {
                            this.$dropdownContainer.detach()
                        }, n.prototype._attachPositioningHandler = function (n, i) {
                            var r = this,
                                o = "scroll.select2." + i.id,
                                s = "resize.select2." + i.id,
                                a = "orientationchange.select2." + i.id,
                                l = this.$container.parents()
                                .filter(t.hasScroll);
                            l.each(function () {
                                    e(this)
                                        .data("select2-scroll-position", {
                                            x: e(this)
                                                .scrollLeft(),
                                            y: e(this)
                                                .scrollTop()
                                        })
                                }), l.on(o, function (t) {
                                    var n = e(this)
                                        .data("select2-scroll-position");
                                    e(this)
                                        .scrollTop(n.y)
                                }), e(window)
                                .on(o + " " + s + " " + a, function (e) {
                                    r._positionDropdown(), r._resizeDropdown()
                                })
                        }, n.prototype._detachPositioningHandler = function (n, i) {
                            var r = "scroll.select2." + i.id,
                                o = "resize.select2." + i.id,
                                s = "orientationchange.select2." + i.id,
                                a = this.$container.parents()
                                .filter(t.hasScroll);
                            a.off(r), e(window)
                                .off(r + " " + o + " " + s)
                        }, n.prototype._positionDropdown = function () {
                            var t = e(window),
                                n = this.$dropdown.hasClass("select2-dropdown--above"),
                                i = this.$dropdown.hasClass("select2-dropdown--below"),
                                r = null,
                                o = this.$container.offset();
                            o.bottom = o.top + this.$container.outerHeight(!1);
                            var s = {
                                height: this.$container.outerHeight(!1)
                            };
                            s.top = o.top, s.bottom = o.top + s.height;
                            var a = {
                                    height: this.$dropdown.outerHeight(!1)
                                },
                                l = {
                                    top: t.scrollTop(),
                                    bottom: t.scrollTop() + t.height()
                                },
                                c = l.top < o.top - a.height,
                                u = l.bottom > o.bottom + a.height,
                                d = {
                                    left: o.left,
                                    top: s.bottom
                                },
                                p = this.$dropdownParent;
                            "static" === p.css("position") && (p = p.offsetParent());
                            var f = p.offset();
                            d.top -= f.top, d.left -= f.left, n || i || (r = "below"), u || !c || n ? !c && u && n && (r = "below") : r = "above", ("above" == r || n && "below" !== r) && (d.top = s.top - a.height), null != r && (this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above")
                                .addClass("select2-dropdown--" + r), this.$container.removeClass("select2-container--below select2-container--above")
                                .addClass("select2-container--" + r)), this.$dropdownContainer.css(d)
                        }, n.prototype._resizeDropdown = function () {
                            var e = {
                                width: this.$container.outerWidth(!1) + "px"
                            };
                            this.options.get("dropdownAutoWidth") && (e.minWidth = e.width, e.width = "auto"), this.$dropdown.css(e)
                        }, n.prototype._showDropdown = function (e) {
                            this.$dropdownContainer.appendTo(this.$dropdownParent), this._positionDropdown(), this._resizeDropdown()
                        }, n
                    }), t.define("select2/dropdown/minimumResultsForSearch", [], function () {
                        function e(t) {
                            for (var n = 0, i = 0; i < t.length; i++) {
                                var r = t[i];
                                r.children ? n += e(r.children) : n++
                            }
                            return n
                        }

                        function t(e, t, n, i) {
                            this.minimumResultsForSearch = n.get("minimumResultsForSearch"), this.minimumResultsForSearch < 0 && (this.minimumResultsForSearch = 1 / 0), e.call(this, t, n, i)
                        }
                        return t.prototype.showSearch = function (t, n) {
                            return e(n.data.results) < this.minimumResultsForSearch ? !1 : t.call(this, n)
                        }, t
                    }), t.define("select2/dropdown/selectOnClose", [], function () {
                        function e() {}
                        return e.prototype.bind = function (e, t, n) {
                            var i = this;
                            e.call(this, t, n), t.on("close", function () {
                                i._handleSelectOnClose()
                            })
                        }, e.prototype._handleSelectOnClose = function () {
                            var e = this.getHighlightedResults();
                            if (!(e.length < 1)) {
                                var t = e.data("data");
                                null != t.element && t.element.selected || null == t.element && t.selected || this.trigger("select", {
                                    data: t
                                })
                            }
                        }, e
                    }), t.define("select2/dropdown/closeOnSelect", [], function () {
                        function e() {}
                        return e.prototype.bind = function (e, t, n) {
                            var i = this;
                            e.call(this, t, n), t.on("select", function (e) {
                                i._selectTriggered(e)
                            }), t.on("unselect", function (e) {
                                i._selectTriggered(e)
                            })
                        }, e.prototype._selectTriggered = function (e, t) {
                            var n = t.originalEvent;
                            n && n.ctrlKey || this.trigger("close", {})
                        }, e
                    }), t.define("select2/i18n/en", [], function () {
                        return {
                            errorLoading: function () {
                                return "The results could not be loaded."
                            },
                            inputTooLong: function (e) {
                                var t = e.input.length - e.maximum,
                                    n = "Please delete " + t + " character";
                                return 1 != t && (n += "s"), n
                            },
                            inputTooShort: function (e) {
                                var t = e.minimum - e.input.length,
                                    n = "Please enter " + t + " or more characters";
                                return n
                            },
                            loadingMore: function () {
                                return "Loading more results\u2026"
                            },
                            maximumSelected: function (e) {
                                var t = "You can only select " + e.maximum + " item";
                                return 1 != e.maximum && (t += "s"), t
                            },
                            noResults: function () {
                                return "No results found"
                            },
                            searching: function () {
                                return "Searching\u2026"
                            }
                        }
                    }), t.define("select2/defaults", ["jquery", "require", "./results", "./selection/single", "./selection/multiple", "./selection/placeholder", "./selection/allowClear", "./selection/search", "./selection/eventRelay", "./utils", "./translation", "./diacritics", "./data/select", "./data/array", "./data/ajax", "./data/tags", "./data/tokenizer", "./data/minimumInputLength", "./data/maximumInputLength", "./data/maximumSelectionLength", "./dropdown", "./dropdown/search", "./dropdown/hidePlaceholder", "./dropdown/infiniteScroll", "./dropdown/attachBody", "./dropdown/minimumResultsForSearch", "./dropdown/selectOnClose", "./dropdown/closeOnSelect", "./i18n/en"], function (e, t, n, i, r, o, s, a, l, c, u, d, p, f, h, g, v, m, y, b, w, x, _, $, k, T, C, S, A) {
                        function E() {
                            this.reset()
                        }
                        E.prototype.apply = function (d) {
                            if (d = e.extend(!0, {}, this.defaults, d), null == d.dataAdapter) {
                                if (null != d.ajax ? d.dataAdapter = h : null != d.data ? d.dataAdapter = f : d.dataAdapter = p, d.minimumInputLength > 0 && (d.dataAdapter = c.Decorate(d.dataAdapter, m)), d.maximumInputLength > 0 && (d.dataAdapter = c.Decorate(d.dataAdapter, y)), d.maximumSelectionLength > 0 && (d.dataAdapter = c.Decorate(d.dataAdapter, b)), d.tags && (d.dataAdapter = c.Decorate(d.dataAdapter, g)), (null != d.tokenSeparators || null != d.tokenizer) && (d.dataAdapter = c.Decorate(d.dataAdapter, v)), null != d.query) {
                                    var A = t(d.amdBase + "compat/query");
                                    d.dataAdapter = c.Decorate(d.dataAdapter, A)
                                }
                                if (null != d.initSelection) {
                                    var E = t(d.amdBase + "compat/initSelection");
                                    d.dataAdapter = c.Decorate(d.dataAdapter, E)
                                }
                            }
                            if (null == d.resultsAdapter && (d.resultsAdapter = n, null != d.ajax && (d.resultsAdapter = c.Decorate(d.resultsAdapter, $)), null != d.placeholder && (d.resultsAdapter = c.Decorate(d.resultsAdapter, _)), d.selectOnClose && (d.resultsAdapter = c.Decorate(d.resultsAdapter, C))), null == d.dropdownAdapter) {
                                if (d.multiple) d.dropdownAdapter = w;
                                else {
                                    var j = c.Decorate(w, x);
                                    d.dropdownAdapter = j
                                }
                                if (0 !== d.minimumResultsForSearch && (d.dropdownAdapter = c.Decorate(d.dropdownAdapter, T)), d.closeOnSelect && (d.dropdownAdapter = c.Decorate(d.dropdownAdapter, S)), null != d.dropdownCssClass || null != d.dropdownCss || null != d.adaptDropdownCssClass) {
                                    var O = t(d.amdBase + "compat/dropdownCss");
                                    d.dropdownAdapter = c.Decorate(d.dropdownAdapter, O)
                                }
                                d.dropdownAdapter = c.Decorate(d.dropdownAdapter, k)
                            }
                            if (null == d.selectionAdapter) {
                                if (d.multiple ? d.selectionAdapter = r : d.selectionAdapter = i, null != d.placeholder && (d.selectionAdapter = c.Decorate(d.selectionAdapter, o)), d.allowClear && (d.selectionAdapter = c.Decorate(d.selectionAdapter, s)), d.multiple && (d.selectionAdapter = c.Decorate(d.selectionAdapter, a)), null != d.containerCssClass || null != d.containerCss || null != d.adaptContainerCssClass) {
                                    var D = t(d.amdBase + "compat/containerCss");
                                    d.selectionAdapter = c.Decorate(d.selectionAdapter, D)
                                }
                                d.selectionAdapter = c.Decorate(d.selectionAdapter, l)
                            }
                            if ("string" == typeof d.language)
                                if (d.language.indexOf("-") > 0) {
                                    var N = d.language.split("-"),
                                        I = N[0];
                                    d.language = [d.language, I]
                                } else d.language = [d.language];
                            if (e.isArray(d.language)) {
                                var P = new u;
                                d.language.push("en");
                                for (var L = d.language, R = 0; R < L.length; R++) {
                                    var q = L[R],
                                        M = {};
                                    try {
                                        M = u.loadPath(q)
                                    } catch (H) {
                                        try {
                                            q = this.defaults.amdLanguageBase + q, M = u.loadPath(q)
                                        } catch (F) {
                                            d.debug && window.console && console.warn && console.warn('Select2: The language file for "' + q + '" could not be automatically loaded. A fallback will be used instead.');
                                            continue
                                        }
                                    }
                                    P.extend(M)
                                }
                                d.translations = P
                            } else {
                                var z = u.loadPath(this.defaults.amdLanguageBase + "en"),
                                    U = new u(d.language);
                                U.extend(z), d.translations = U
                            }
                            return d
                        }, E.prototype.reset = function () {
                            function t(e) {
                                function t(e) {
                                    return d[e] || e
                                }
                                return e.replace(/[^\u0000-\u007E]/g, t)
                            }

                            function n(i, r) {
                                if ("" === e.trim(i.term)) return r;
                                if (r.children && r.children.length > 0) {
                                    for (var o = e.extend(!0, {}, r), s = r.children.length - 1; s >= 0; s--) {
                                        var a = r.children[s],
                                            l = n(i, a);
                                        null == l && o.children.splice(s, 1)
                                    }
                                    return o.children.length > 0 ? o : n(i, o)
                                }
                                var c = t(r.text)
                                    .toUpperCase(),
                                    u = t(i.term)
                                    .toUpperCase();
                                return c.indexOf(u) > -1 ? r : null
                            }
                            this.defaults = {
                                amdBase: "./",
                                amdLanguageBase: "./i18n/",
                                closeOnSelect: !0,
                                debug: !1,
                                dropdownAutoWidth: !1,
                                escapeMarkup: c.escapeMarkup,
                                language: A,
                                matcher: n,
                                minimumInputLength: 0,
                                maximumInputLength: 0,
                                maximumSelectionLength: 0,
                                minimumResultsForSearch: 0,
                                selectOnClose: !1,
                                sorter: function (e) {
                                    return e
                                },
                                templateResult: function (e) {
                                    return e.text
                                },
                                templateSelection: function (e) {
                                    return e.text
                                },
                                theme: "default",
                                width: "resolve"
                            }
                        }, E.prototype.set = function (t, n) {
                            var i = e.camelCase(t),
                                r = {};
                            r[i] = n;
                            var o = c._convertData(r);
                            e.extend(this.defaults, o)
                        };
                        var j = new E;
                        return j
                    }), t.define("select2/options", ["require", "jquery", "./defaults", "./utils"], function (e, t, n, i) {
                        function r(t, r) {
                            if (this.options = t, null != r && this.fromElement(r), this.options = n.apply(this.options), r && r.is("input")) {
                                var o = e(this.get("amdBase") + "compat/inputData");
                                this.options.dataAdapter = i.Decorate(this.options.dataAdapter, o)
                            }
                        }
                        return r.prototype.fromElement = function (e) {
                            var n = ["select2"];
                            null == this.options.multiple && (this.options.multiple = e.prop("multiple")), null == this.options.disabled && (this.options.disabled = e.prop("disabled")), null == this.options.language && (e.prop("lang") ? this.options.language = e.prop("lang")
                                .toLowerCase() : e.closest("[lang]")
                                .prop("lang") && (this.options.language = e.closest("[lang]")
                                    .prop("lang"))), null == this.options.dir && (e.prop("dir") ? this.options.dir = e.prop("dir") : e.closest("[dir]")
                                .prop("dir") ? this.options.dir = e.closest("[dir]")
                                .prop("dir") : this.options.dir = "ltr"), e.prop("disabled", this.options.disabled), e.prop("multiple", this.options.multiple), e.data("select2Tags") && (this.options.debug && window.console && console.warn && console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'), e.data("data", e.data("select2Tags")), e.data("tags", !0)), e.data("ajaxUrl") && (this.options.debug && window.console && console.warn && console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."), e.attr("ajax--url", e.data("ajaxUrl")), e.data("ajax--url", e.data("ajaxUrl")));
                            var r = {};
                            r = t.fn.jquery && "1." == t.fn.jquery.substr(0, 2) && e[0].dataset ? t.extend(!0, {}, e[0].dataset, e.data()) : e.data();
                            var o = t.extend(!0, {}, r);
                            o = i._convertData(o);
                            for (var s in o) t.inArray(s, n) > -1 || (t.isPlainObject(this.options[s]) ? t.extend(this.options[s], o[s]) : this.options[s] = o[s]);
                            return this
                        }, r.prototype.get = function (e) {
                            return this.options[e]
                        }, r.prototype.set = function (e, t) {
                            this.options[e] = t
                        }, r
                    }), t.define("select2/core", ["jquery", "./options", "./utils", "./keys"], function (e, t, n, i) {
                        var r = function (e, n) {
                            null != e.data("select2") && e.data("select2")
                                .destroy(), this.$element = e, this.id = this._generateId(e), n = n || {}, this.options = new t(n, e), r.__super__.constructor.call(this);
                            var i = e.attr("tabindex") || 0;
                            e.data("old-tabindex", i), e.attr("tabindex", "-1");
                            var o = this.options.get("dataAdapter");
                            this.dataAdapter = new o(e, this.options);
                            var s = this.render();
                            this._placeContainer(s);
                            var a = this.options.get("selectionAdapter");
                            this.selection = new a(e, this.options), this.$selection = this.selection.render(), this.selection.position(this.$selection, s);
                            var l = this.options.get("dropdownAdapter");
                            this.dropdown = new l(e, this.options), this.$dropdown = this.dropdown.render(), this.dropdown.position(this.$dropdown, s);
                            var c = this.options.get("resultsAdapter");
                            this.results = new c(e, this.options, this.dataAdapter), this.$results = this.results.render(), this.results.position(this.$results, this.$dropdown);
                            var u = this;
                            this._bindAdapters(), this._registerDomEvents(), this._registerDataEvents(), this._registerSelectionEvents(), this._registerDropdownEvents(), this._registerResultsEvents(), this._registerEvents(), this.dataAdapter.current(function (e) {
                                u.trigger("selection:update", {
                                    data: e
                                })
                            }), e.addClass("select2-hidden-accessible"), e.attr("aria-hidden", "true"), this._syncAttributes(), e.data("select2", this)
                        };
                        return n.Extend(r, n.Observable), r.prototype._generateId = function (e) {
                            var t = "";
                            return t = null != e.attr("id") ? e.attr("id") : null != e.attr("name") ? e.attr("name") + "-" + n.generateChars(2) : n.generateChars(4), t = t.replace(/(:|\.|\[|\]|,)/g, ""), t = "select2-" + t
                        }, r.prototype._placeContainer = function (e) {
                            e.insertAfter(this.$element);
                            var t = this._resolveWidth(this.$element, this.options.get("width"));
                            null != t && e.css("width", t)
                        }, r.prototype._resolveWidth = function (e, t) {
                            var n = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
                            if ("resolve" == t) {
                                var i = this._resolveWidth(e, "style");
                                return null != i ? i : this._resolveWidth(e, "element")
                            }
                            if ("element" == t) {
                                var r = e.outerWidth(!1);
                                return 0 >= r ? "auto" : r + "px"
                            }
                            if ("style" == t) {
                                var o = e.attr("style");
                                if ("string" != typeof o) return null;
                                for (var s = o.split(";"), a = 0, l = s.length; l > a; a += 1) {
                                    var c = s[a].replace(/\s/g, ""),
                                        u = c.match(n);
                                    if (null !== u && u.length >= 1) return u[1]
                                }
                                return null
                            }
                            return t
                        }, r.prototype._bindAdapters = function () {
                            this.dataAdapter.bind(this, this.$container), this.selection.bind(this, this.$container), this.dropdown.bind(this, this.$container), this.results.bind(this, this.$container)
                        }, r.prototype._registerDomEvents = function () {
                            var t = this;
                            this.$element.on("change.select2", function () {
                                t.dataAdapter.current(function (e) {
                                    t.trigger("selection:update", {
                                        data: e
                                    })
                                })
                            }), this._sync = n.bind(this._syncAttributes, this), this.$element[0].attachEvent && this.$element[0].attachEvent("onpropertychange", this._sync);
                            var i = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                            null != i ? (this._observer = new i(function (n) {
                                e.each(n, t._sync)
                            }), this._observer.observe(this.$element[0], {
                                attributes: !0,
                                subtree: !1
                            })) : this.$element[0].addEventListener && this.$element[0].addEventListener("DOMAttrModified", t._sync, !1)
                        }, r.prototype._registerDataEvents = function () {
                            var e = this;
                            this.dataAdapter.on("*", function (t, n) {
                                e.trigger(t, n)
                            })
                        }, r.prototype._registerSelectionEvents = function () {
                            var t = this,
                                n = ["toggle", "focus"];
                            this.selection.on("toggle", function () {
                                t.toggleDropdown()
                            }), this.selection.on("focus", function (e) {
                                t.focus(e)
                            }), this.selection.on("*", function (i, r) {
                                -1 === e.inArray(i, n) && t.trigger(i, r)
                            })
                        }, r.prototype._registerDropdownEvents = function () {
                            var e = this;
                            this.dropdown.on("*", function (t, n) {
                                e.trigger(t, n)
                            })
                        }, r.prototype._registerResultsEvents = function () {
                            var e = this;
                            this.results.on("*", function (t, n) {
                                e.trigger(t, n)
                            })
                        }, r.prototype._registerEvents = function () {
                            var e = this;
                            this.on("open", function () {
                                e.$container.addClass("select2-container--open")
                            }), this.on("close", function () {
                                e.$container.removeClass("select2-container--open")
                            }), this.on("enable", function () {
                                e.$container.removeClass("select2-container--disabled")
                            }), this.on("disable", function () {
                                e.$container.addClass("select2-container--disabled")
                            }), this.on("blur", function () {
                                e.$container.removeClass("select2-container--focus")
                            }), this.on("query", function (t) {
                                e.isOpen() || e.trigger("open", {}), this.dataAdapter.query(t, function (n) {
                                    e.trigger("results:all", {
                                        data: n,
                                        query: t
                                    })
                                })
                            }), this.on("query:append", function (t) {
                                this.dataAdapter.query(t, function (n) {
                                    e.trigger("results:append", {
                                        data: n,
                                        query: t
                                    })
                                })
                            }), this.on("keypress", function (t) {
                                var n = t.which;
                                e.isOpen() ? n === i.ESC || n === i.TAB || n === i.UP && t.altKey ? (e.close(), t.preventDefault()) : n === i.ENTER ? (e.trigger("results:select", {}), t.preventDefault()) : n === i.SPACE && t.ctrlKey ? (e.trigger("results:toggle", {}), t.preventDefault()) : n === i.UP ? (e.trigger("results:previous", {}), t.preventDefault()) : n === i.DOWN && (e.trigger("results:next", {}), t.preventDefault()) : (n === i.ENTER || n === i.SPACE || n === i.DOWN && t.altKey) && (e.open(), t.preventDefault())
                            })
                        }, r.prototype._syncAttributes = function () {
                            this.options.set("disabled", this.$element.prop("disabled")), this.options.get("disabled") ? (this.isOpen() && this.close(), this.trigger("disable", {})) : this.trigger("enable", {})
                        }, r.prototype.trigger = function (e, t) {
                            var n = r.__super__.trigger,
                                i = {
                                    open: "opening",
                                    close: "closing",
                                    select: "selecting",
                                    unselect: "unselecting"
                                };
                            if (void 0 === t && (t = {}), e in i) {
                                var o = i[e],
                                    s = {
                                        prevented: !1,
                                        name: e,
                                        args: t
                                    };
                                if (n.call(this, o, s), s.prevented) return void(t.prevented = !0)
                            }
                            n.call(this, e, t)
                        }, r.prototype.toggleDropdown = function () {
                            this.options.get("disabled") || (this.isOpen() ? this.close() : this.open())
                        }, r.prototype.open = function () {
                            this.isOpen() || this.trigger("query", {})
                        }, r.prototype.close = function () {
                            this.isOpen() && this.trigger("close", {})
                        }, r.prototype.isOpen = function () {
                            return this.$container.hasClass("select2-container--open")
                        }, r.prototype.hasFocus = function () {
                            return this.$container.hasClass("select2-container--focus")
                        }, r.prototype.focus = function (e) {
                            this.hasFocus() || (this.$container.addClass("select2-container--focus"), this.trigger("focus", {}))
                        }, r.prototype.enable = function (e) {
                            this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'), (null == e || 0 === e.length) && (e = [!0]);
                            var t = !e[0];
                            this.$element.prop("disabled", t)
                        }, r.prototype.data = function () {
                            this.options.get("debug") && arguments.length > 0 && window.console && console.warn && console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');
                            var e = [];
                            return this.dataAdapter.current(function (t) {
                                e = t
                            }), e
                        }, r.prototype.val = function (t) {
                            if (this.options.get("debug") && window.console && console.warn && console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),
                                null == t || 0 === t.length) return this.$element.val();
                            var n = t[0];
                            e.isArray(n) && (n = e.map(n, function (e) {
                                    return e.toString()
                                })), this.$element.val(n)
                                .trigger("change")
                        }, r.prototype.destroy = function () {
                            this.$container.remove(), this.$element[0].detachEvent && this.$element[0].detachEvent("onpropertychange", this._sync), null != this._observer ? (this._observer.disconnect(), this._observer = null) : this.$element[0].removeEventListener && this.$element[0].removeEventListener("DOMAttrModified", this._sync, !1), this._sync = null, this.$element.off(".select2"), this.$element.attr("tabindex", this.$element.data("old-tabindex")), this.$element.removeClass("select2-hidden-accessible"), this.$element.attr("aria-hidden", "false"), this.$element.removeData("select2"), this.dataAdapter.destroy(), this.selection.destroy(), this.dropdown.destroy(), this.results.destroy(), this.dataAdapter = null, this.selection = null, this.dropdown = null, this.results = null
                        }, r.prototype.render = function () {
                            var t = e('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');
                            return t.attr("dir", this.options.get("dir")), this.$container = t, this.$container.addClass("select2-container--" + this.options.get("theme")), t.data("element", this.$element), t
                        }, r
                    }), t.define("select2/compat/utils", ["jquery"], function (e) {
                        function t(t, n, i) {
                            var r, o, s = [];
                            r = e.trim(t.attr("class")), r && (r = "" + r, e(r.split(/\s+/))
                                .each(function () {
                                    0 === this.indexOf("select2-") && s.push(this)
                                })), r = e.trim(n.attr("class")), r && (r = "" + r, e(r.split(/\s+/))
                                .each(function () {
                                    0 !== this.indexOf("select2-") && (o = i(this), null != o && s.push(o))
                                })), t.attr("class", s.join(" "))
                        }
                        return {
                            syncCssClasses: t
                        }
                    }), t.define("select2/compat/containerCss", ["jquery", "./utils"], function (e, t) {
                        function n(e) {
                            return null
                        }

                        function i() {}
                        return i.prototype.render = function (i) {
                            var r = i.call(this),
                                o = this.options.get("containerCssClass") || "";
                            e.isFunction(o) && (o = o(this.$element));
                            var s = this.options.get("adaptContainerCssClass");
                            if (s = s || n, -1 !== o.indexOf(":all:")) {
                                o = o.replace(":all:", "");
                                var a = s;
                                s = function (e) {
                                    var t = a(e);
                                    return null != t ? t + " " + e : e
                                }
                            }
                            var l = this.options.get("containerCss") || {};
                            return e.isFunction(l) && (l = l(this.$element)), t.syncCssClasses(r, this.$element, s), r.css(l), r.addClass(o), r
                        }, i
                    }), t.define("select2/compat/dropdownCss", ["jquery", "./utils"], function (e, t) {
                        function n(e) {
                            return null
                        }

                        function i() {}
                        return i.prototype.render = function (i) {
                            var r = i.call(this),
                                o = this.options.get("dropdownCssClass") || "";
                            e.isFunction(o) && (o = o(this.$element));
                            var s = this.options.get("adaptDropdownCssClass");
                            if (s = s || n, -1 !== o.indexOf(":all:")) {
                                o = o.replace(":all:", "");
                                var a = s;
                                s = function (e) {
                                    var t = a(e);
                                    return null != t ? t + " " + e : e
                                }
                            }
                            var l = this.options.get("dropdownCss") || {};
                            return e.isFunction(l) && (l = l(this.$element)), t.syncCssClasses(r, this.$element, s), r.css(l), r.addClass(o), r
                        }, i
                    }), t.define("select2/compat/initSelection", ["jquery"], function (e) {
                        function t(e, t, n) {
                            n.get("debug") && window.console && console.warn && console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"), this.initSelection = n.get("initSelection"), this._isInitialized = !1, e.call(this, t, n)
                        }
                        return t.prototype.current = function (t, n) {
                            var i = this;
                            return this._isInitialized ? void t.call(this, n) : void this.initSelection.call(null, this.$element, function (t) {
                                i._isInitialized = !0, e.isArray(t) || (t = [t]), n(t)
                            })
                        }, t
                    }), t.define("select2/compat/inputData", ["jquery"], function (e) {
                        function t(e, t, n) {
                            this._currentData = [], this._valueSeparator = n.get("valueSeparator") || ",", "hidden" === t.prop("type") && n.get("debug") && console && console.warn && console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."), e.call(this, t, n)
                        }
                        return t.prototype.current = function (t, n) {
                            function i(t, n) {
                                var r = [];
                                return t.selected || -1 !== e.inArray(t.id, n) ? (t.selected = !0, r.push(t)) : t.selected = !1, t.children && r.push.apply(r, i(t.children, n)), r
                            }
                            for (var r = [], o = 0; o < this._currentData.length; o++) {
                                var s = this._currentData[o];
                                r.push.apply(r, i(s, this.$element.val()
                                    .split(this._valueSeparator)))
                            }
                            n(r)
                        }, t.prototype.select = function (t, n) {
                            if (this.options.get("multiple")) {
                                var i = this.$element.val();
                                i += this._valueSeparator + n.id, this.$element.val(i), this.$element.trigger("change")
                            } else this.current(function (t) {
                                e.map(t, function (e) {
                                    e.selected = !1
                                })
                            }), this.$element.val(n.id), this.$element.trigger("change")
                        }, t.prototype.unselect = function (e, t) {
                            var n = this;
                            t.selected = !1, this.current(function (e) {
                                for (var i = [], r = 0; r < e.length; r++) {
                                    var o = e[r];
                                    t.id != o.id && i.push(o.id)
                                }
                                n.$element.val(i.join(n._valueSeparator)), n.$element.trigger("change")
                            })
                        }, t.prototype.query = function (e, t, n) {
                            for (var i = [], r = 0; r < this._currentData.length; r++) {
                                var o = this._currentData[r],
                                    s = this.matches(t, o);
                                null !== s && i.push(s)
                            }
                            n({
                                results: i
                            })
                        }, t.prototype.addOptions = function (t, n) {
                            var i = e.map(n, function (t) {
                                return e.data(t[0], "data")
                            });
                            this._currentData.push.apply(this._currentData, i)
                        }, t
                    }), t.define("select2/compat/matcher", ["jquery"], function (e) {
                        function t(t) {
                            function n(n, i) {
                                var r = e.extend(!0, {}, i);
                                if (null == n.term || "" === e.trim(n.term)) return r;
                                if (i.children) {
                                    for (var o = i.children.length - 1; o >= 0; o--) {
                                        var s = i.children[o],
                                            a = t(n.term, s.text, s);
                                        a || r.children.splice(o, 1)
                                    }
                                    if (r.children.length > 0) return r
                                }
                                return t(n.term, i.text, i) ? r : null
                            }
                            return n
                        }
                        return t
                    }), t.define("select2/compat/query", [], function () {
                        function e(e, t, n) {
                            n.get("debug") && window.console && console.warn && console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."), e.call(this, t, n)
                        }
                        return e.prototype.query = function (e, t, n) {
                            t.callback = n;
                            var i = this.options.get("query");
                            i.call(null, t)
                        }, e
                    }), t.define("select2/dropdown/attachContainer", [], function () {
                        function e(e, t, n) {
                            e.call(this, t, n)
                        }
                        return e.prototype.position = function (e, t, n) {
                            var i = n.find(".dropdown-wrapper");
                            i.append(t), t.addClass("select2-dropdown--below"), n.addClass("select2-container--below")
                        }, e
                    }), t.define("select2/dropdown/stopPropagation", [], function () {
                        function e() {}
                        return e.prototype.bind = function (e, t, n) {
                            e.call(this, t, n);
                            var i = ["blur", "change", "click", "dblclick", "focus", "focusin", "focusout", "input", "keydown", "keyup", "keypress", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseup", "search", "touchend", "touchstart"];
                            this.$dropdown.on(i.join(" "), function (e) {
                                e.stopPropagation()
                            })
                        }, e
                    }), t.define("select2/selection/stopPropagation", [], function () {
                        function e() {}
                        return e.prototype.bind = function (e, t, n) {
                            e.call(this, t, n);
                            var i = ["blur", "change", "click", "dblclick", "focus", "focusin", "focusout", "input", "keydown", "keyup", "keypress", "mousedown", "mouseenter", "mouseleave", "mousemove", "mouseover", "mouseup", "search", "touchend", "touchstart"];
                            this.$selection.on(i.join(" "), function (e) {
                                e.stopPropagation()
                            })
                        }, e
                    }),
                    function (n) {
                        "function" == typeof t.define && t.define.amd ? t.define("jquery-mousewheel", ["jquery"], n) : "object" == typeof exports ? module.exports = n : n(e)
                    }(function (e) {
                        function t(t) {
                            var s = t || window.event,
                                a = l.call(arguments, 1),
                                c = 0,
                                d = 0,
                                p = 0,
                                f = 0,
                                h = 0,
                                g = 0;
                            if (t = e.event.fix(s), t.type = "mousewheel", "detail" in s && (p = -1 * s.detail), "wheelDelta" in s && (p = s.wheelDelta), "wheelDeltaY" in s && (p = s.wheelDeltaY), "wheelDeltaX" in s && (d = -1 * s.wheelDeltaX), "axis" in s && s.axis === s.HORIZONTAL_AXIS && (d = -1 * p, p = 0), c = 0 === p ? d : p, "deltaY" in s && (p = -1 * s.deltaY, c = p), "deltaX" in s && (d = s.deltaX, 0 === p && (c = -1 * d)), 0 !== p || 0 !== d) {
                                if (1 === s.deltaMode) {
                                    var v = e.data(this, "mousewheel-line-height");
                                    c *= v, p *= v, d *= v
                                } else if (2 === s.deltaMode) {
                                    var m = e.data(this, "mousewheel-page-height");
                                    c *= m, p *= m, d *= m
                                }
                                if (f = Math.max(Math.abs(p), Math.abs(d)), (!o || o > f) && (o = f, i(s, f) && (o /= 40)), i(s, f) && (c /= 40, d /= 40, p /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / o), d = Math[d >= 1 ? "floor" : "ceil"](d / o), p = Math[p >= 1 ? "floor" : "ceil"](p / o), u.settings.normalizeOffset && this.getBoundingClientRect) {
                                    var y = this.getBoundingClientRect();
                                    h = t.clientX - y.left, g = t.clientY - y.top
                                }
                                return t.deltaX = d, t.deltaY = p, t.deltaFactor = o, t.offsetX = h, t.offsetY = g, t.deltaMode = 0, a.unshift(t, c, d, p), r && clearTimeout(r), r = setTimeout(n, 200), (e.event.dispatch || e.event.handle)
                                    .apply(this, a)
                            }
                        }

                        function n() {
                            o = null
                        }

                        function i(e, t) {
                            return u.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 === 0
                        }
                        var r, o, s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
                            a = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
                            l = Array.prototype.slice;
                        if (e.event.fixHooks)
                            for (var c = s.length; c;) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
                        var u = e.event.special.mousewheel = {
                            version: "3.1.12",
                            setup: function () {
                                if (this.addEventListener)
                                    for (var n = a.length; n;) this.addEventListener(a[--n], t, !1);
                                else this.onmousewheel = t;
                                e.data(this, "mousewheel-line-height", u.getLineHeight(this)), e.data(this, "mousewheel-page-height", u.getPageHeight(this))
                            },
                            teardown: function () {
                                if (this.removeEventListener)
                                    for (var n = a.length; n;) this.removeEventListener(a[--n], t, !1);
                                else this.onmousewheel = null;
                                e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
                            },
                            getLineHeight: function (t) {
                                var n = e(t),
                                    i = n["offsetParent" in e.fn ? "offsetParent" : "parent"]();
                                return i.length || (i = e("body")), parseInt(i.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
                            },
                            getPageHeight: function (t) {
                                return e(t)
                                    .height()
                            },
                            settings: {
                                adjustOldDeltas: !0,
                                normalizeOffset: !0
                            }
                        };
                        e.fn.extend({
                            mousewheel: function (e) {
                                return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
                            },
                            unmousewheel: function (e) {
                                return this.unbind("mousewheel", e)
                            }
                        })
                    }), t.define("jquery.select2", ["jquery", "jquery-mousewheel", "./select2/core", "./select2/defaults"], function (e, t, n, i) {
                        if (null == e.fn.select2) {
                            var r = ["open", "close", "destroy"];
                            e.fn.select2 = function (t) {
                                if (t = t || {}, "object" == typeof t) return this.each(function () {
                                    var i = e.extend(!0, {}, t);
                                    new n(e(this), i)
                                }), this;
                                if ("string" == typeof t) {
                                    var i;
                                    return this.each(function () {
                                        var n = e(this)
                                            .data("select2");
                                        null == n && window.console && console.error && console.error("The select2('" + t + "') method was called on an element that is not using Select2.");
                                        var r = Array.prototype.slice.call(arguments, 1);
                                        i = n[t].apply(n, r)
                                    }), e.inArray(t, r) > -1 ? this : i
                                }
                                throw new Error("Invalid arguments for Select2: " + t)
                            }
                        }
                        return null == e.fn.select2.defaults && (e.fn.select2.defaults = i), n
                    }), {
                        define: t.define,
                        require: t.require
                    }
            }(),
            n = t.require("jquery.select2");
        return e.fn.select2.amd = t, n
    });
var backendUrl = "https://api.hellojam.fr/api/v1";
_.templateSettings = {
        interpolate: /\{\{\=(.+?)\}\}/g,
        evaluate: /\{\{(.+?)\}\}/g
    }, $(document)
    .ready(function () {
        $("[markdown-remote]")
            .each(function (e) {
                var t = $(this)
                    .attr("markdown-remote"),
                    n = $(this),
                    i = $.ajax({
                        url: t,
                        method: "GET"
                    });
                i.done(function (e) {
                    n.html(markdown.toHTML(e))
                })
            }), $("[data-track-click]")
            .each(function (e) {
                var t = $(this)
                    .attr("data-track-click-action"),
                    n = $(this)
                    .attr("data-track-click-label"),
                    i = $(this);
                i.on("click", function () {
                    trackEvent("Click", t, n)
                })
            }), $("[data-track-offer]")
            .each(function (e) {
                var t = $(this)
                    .attr("data-track-offer"),
                    n = $(this);
                n.on("click", function () {
                    trackEvent("Jobs offers", "Apply", t)
                })
            })
    }), $(document)
    .ready(function () {
        if (0 !== $("body.commandes")
            .length) {
            var e = $.templates("#commandeTemplate");
            $.ajax({
                    url: backendUrl + "/commands.json"
                })
                .done(function (t) {
                    var n = _.map(t.commands, function (e) {
                        return {
                            usage: e.usage,
                            description: e.description,
                            example: _.keys(e.examples)[0]
                        }
                    });
                    $(".panel-group")
                        .append(e.render(n))
                })
        }
    });
var messageTimeoutInterval = 1e3,
    exampleTimeoutInterval = 1500,
    numberOfMessagesByExample = 4,
    examples, formations = [{
        id: "Anthropologie",
        text: "Anthropologie"
    }, {
        id: "Architecture",
        text: "Architecture"
    }, {
        id: "Art",
        text: "Art"
    }, {
        id: "Autre",
        text: "Autre"
    }, {
        id: "Biologie",
        text: "Biologie"
    }, {
        id: "Commerce",
        text: "Commerce"
    }, {
        id: "Communication/publicit\xe9",
        text: "Communication/publicit\xe9"
    }, {
        id: "Comptabilit\xe9",
        text: "Comptabilit\xe9"
    }, {
        id: "Dentaire",
        text: "Dentaire"
    }, {
        id: "Design",
        text: "Design"
    }, {
        id: "Droit",
        text: "Droit"
    }, {
        id: "Economie",
        text: "Economie"
    }, {
        id: "Finance",
        text: "Finance"
    }, {
        id: "G\xe9ographie",
        text: "G\xe9ographie"
    }, {
        id: "G\xe9opolitique",
        text: "G\xe9opolitique"
    }, {
        id: "Histoire",
        text: "Histoire"
    }, {
        id: "Informatique",
        text: "Informatique"
    }, {
        id: "Ing\xe9nierie",
        text: "Ing\xe9nierie"
    }, {
        id: "Journalisme",
        text: "Journalisme"
    }, {
        id: "LEA",
        text: "LEA"
    }, {
        id: "Marketing",
        text: "Marketing"
    }, {
        id: "M\xe9decine",
        text: "M\xe9decine"
    }, {
        id: "Musique",
        text: "Musique"
    }, {
        id: "Philosophie",
        text: "Philosophie"
    }, {
        id: "Psychologie",
        text: "Psychologie"
    }, {
        id: "Sciences Politiques",
        text: "Sciences Politiques"
    }, {
        id: "Sociologie",
        text: "Sociologie"
    }],
    user;
$(document)
    .ready(function () {
        trackEvent("Page", "ready", "Visit homepage"), (0 !== $("body.index")
            .length || 0 !== $("body.bac_index")
            .length) && (0 !== $("body.bac_index")
            .length ? (initializeReferrer("nyvJF"), examples = bacExamples()) : (initializeReferrer(), examples = mainExamples()), carousel(), showFooterOnScroll(), arrowClickScroll(), initializeAnalyticsTracking(), $("form#extra_informations")
            .submit(function (e) {
                if (e.preventDefault(), !user) return !1;
                var t = $(this),
                    n = t.find(".school")
                    .val()[0],
                    i = t.find(".diploma")
                    .val();
                $(".school")
                    .prop("disabled", !0), $(".diploma")
                    .prop("disabled", !0), trackEvent("Registration", "perform", "Send extra informations");
                var r = $.ajax({
                    url: backendUrl + "/users/" + user.id + ".json",
                    method: "PATCH",
                    dataType: "json",
                    data: {
                        user: {
                            community_id: n,
                            about: i,
                            authentication_token: user.authentication_token
                        }
                    }
                });
                r.done(function () {
                    $(".school")
                        .prop("disabled", !1), $(".diploma")
                        .prop("disabled", !1), $("#myModal")
                        .modal("hide")
                }), r.fail(function () {
                    $(".school")
                        .prop("disabled", !1), $(".diploma")
                        .prop("disabled", !1)
                })
            }), $("form#user_registration")
            .submit(onUserRegistration), $("form#user_registration_footer")
            .submit(onUserRegistration))
    });