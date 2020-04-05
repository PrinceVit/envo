/*
* PLUGINS
*/
//import "babel-polyfill"; // uncomment if you need IE11 or iOS support
import slick from 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import Foundation from 'foundation-sites';
import {default as swal} from 'sweetalert2'

require('@fancyapps/fancybox/dist/jquery.fancybox.css');
const fancybox = require('@fancyapps/fancybox');

import is from '!imports-loader?define=>undefined!is_js';
import "hamburgers";
import 'hamburgers/dist/hamburgers.min.css';
import 'move-js';
/*
* APP
*/
const ScrollArray = [];
const App = {
    isTouch() {
        return is.mobile() || is.tablet();
    },
    getGoogleMapsApiKey() {
        return window.googleMapsApiKey || ''
    },
    startFastClick() {
        if ('touchAction' in document.body.style) {
            document.body.style.touchAction = 'manipulation';
        } else {
            require.ensure(['fastclick'], (require) => {
                const FastClick = require('fastclick');

                window.addEventListener('load', () => {
                    FastClick.attach(document.body);
                });
            }, 'fastclick');
        }
    },

    search() {
        $(document).on('click', '.header .search', function () {
            let _ = $(this);
            let navBox = _.closest('.nav-bar');
            let searchBox = navBox.siblings('.search-box');
            searchBox.toggleClass('active');
        });
    },

    menuRwd() {
        $(document).on('click', '.hamburger', function () {
            let _ = $(this);
            _.toggleClass('is-active');
            _.siblings('.menu').slideToggle();
            _.siblings('.menu').toggleClass('active');
        });
    },

    beforeAfter() {
        setTimeout(function () {
            $(".laptop").twentytwenty();
            let width = $(".laptop img").width() / 2;
            $(".laptop").css({"position": "relative", "left": "calc(50% - " + width + "px)"});
        }, 500);

    },

    initialize() {
        $('.fancybox').fancybox();
        $(document).foundation();
    },
    initMap() {
        const key = (this.getGoogleMapsApiKey() !== '') ? '?key=' + this.getGoogleMapsApiKey() : '';
        const findMap = document.getElementsByClassName('gmap');
        const scriptUrl = "http://maps.google.com/maps/api/js" + key;

        const loadMap = function () {
            for (let i = findMap.length - 1; i >= 0; i--) {
                let myMap = findMap[i];

                let center = new google.maps.LatLng(myMap.getAttribute('data-lat'), myMap.getAttribute('data-lon'));
                let zoom = parseInt(myMap.getAttribute('data-zoom')) || 13;

                let map = new google.maps.Map(myMap, {
                    zoom,
                    center,
                    disableDefaultUI: false,
                    draggable: !App.isTouch(),
                    scrollwheel: false
                });

                let markerOptions = {
                    map: map,
                    //  icon: 'assets/img/point.png',
                    position: center
                };

                let marker = new google.maps.Marker(markerOptions);
            }
        };
        if (findMap.length) {
            const s = document.createElement('script');
            s.setAttribute('src', scriptUrl);
            s.onload = loadMap;
            document.body.appendChild(s);
        }
    },
    showMessage(...args) {
        swal(...args);
    },

    aos() {
        AOS.init({
            duration: 500,
        });
    },

    popUpActive(){
        $(document).on('click touchstart',".chart-item__pointer ",function(){
            let item = $(this);
            let item_number = item.attr("data-item");
            let container = item.closest('.section--content');
            $('[data-item=' + item_number+']').fadeIn();
            $('.popUp[data-item=' + item_number+']').addClass('active');
            $('.mask').fadeIn();
        });
    },

    popUpClose(){
        $(document).on('click touchstart',".close",function(){
            $('.mask').fadeOut();

            $('.popUp.active').hide();
            $('.popUp.active').removeClass('active');
        });
    },

    fixedHeader(){
        let headerHeight =  parseInt($('.header').outerHeight());
        let header = $('.header');
        if( $(window).scrollTop() > headerHeight/2){
            header.addClass('fixed');
        }else{
            header.removeClass('fixed');
        }
    },

    SlideToId() {
        $(document).on('click',".nav-bar a",function(e){
            let item_menu = $(this);
            e.preventDefault();

            let dataSpy = item_menu.attr('data-spy');
            let section = $("div[data-spy=" + dataSpy + "]");
            let header = $('.header').height();
            $("html, body").animate({ scrollTop: section.offset().top - header }, 600);
            $('.nav-bar a').removeClass('active');
            item_menu.addClass('active');
        });
    },
    //
    scrollSpy(){
       let scrollElement = $("div[data-spy]");
       let top = parseInt($(window).scrollTop());
       let menu = $('nav.nav-bar');

        scrollElement.each(function(){
            let item = $(this);
            let data_spy = item[0].dataset.spy;
            console.log(item[0].offsetTop - $('.header.fixed').outerHeight());
            if( top >= parseInt(item[0].offsetTop - $('.header.fixed').outerHeight() - 10) && top <= (parseInt(item[0].offsetTop) + parseInt(item[0].offsetHeight) - $('.header.fixed').outerHeight() ) ){
                menu.find("a[data-spy]").removeClass('active');
                menu.find("[data-spy='" + data_spy +"']").addClass('active');
            }
        });
    },

    


    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.startFastClick();
            this.initialize();
            this.initMap();
            this.aos();
            this.search();
            this.menuRwd();
            this.popUpActive();
            this.beforeAfter();
            this.popUpClose();
            this.SlideToId();
            this.fixedHeader();
            // this.scrollSpy();
        }, false);

        window.onload = () => {

        };

        window.onresize = () => {

        };

        window.onscroll = () =>{
            this.fixedHeader();
            this.scrollSpy();

        }
    }
}
window.showMessage = App.showMessage;
App.init();
