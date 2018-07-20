import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Gallery extends Vue {
  readonly imgSlides = [
    {
      src: require<string>("../static/gallery/20160709150245_1.jpg"),
      desc: "gallery.pic-q-host"
    },
    {
      src: require<string>("../static/gallery/20170319154359_1.jpg"),
      desc: "gallery.pic-beauclair-sunset"
    },
    {
      src: require<string>("../static/gallery/20170319162423_1.jpg"),
      desc: "gallery.pic-beauclair-river"
    },
    {
      src: require<string>("../static/gallery/20170329193830_1.jpg"),
      desc: "gallery.pic-beauclair-majoran"
    },
    {
      src: require<string>("../static/gallery/20170331194617_1.jpg"),
      desc: "gallery.pic-beauclair-sunrise"
    },
    {
      src: require<string>("../static/gallery/20170406211004_1.jpg"),
      desc: "gallery.pic-toussaint-bhad"
    }
  ];

  readonly slides = this.imgSlides.length;
}
