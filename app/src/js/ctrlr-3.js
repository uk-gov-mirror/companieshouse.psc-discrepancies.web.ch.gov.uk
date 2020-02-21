window.onload = function(event) {
  Product.displayDetails(0, true);
  Product.mountEventListeners();
}

var Product = {
  /**
   * Public poperties
   */
  sizes: [],
  quantity: 0,
  classString: '',
  /**
   * Display product details
   *
   * @param {number} i - the style index in the base record
   * @param {boolean} p - boolean indicating if the page has just loaded
   * @param {number} s - index of the skus array for a given style
   */
   displayDetails: function (i, p, s) {

    try {

      var sk = s ? s : 0;
      document.querySelector(".prod-details .title").innerHTML = baseRecord.name;
      document.querySelector(".prod-details .description").innerHTML = baseRecord.description;
      document.querySelector(".prod-details .price .current").innerHTML = '&pound;' + baseRecord.styles[i].skus[sk].price.currentPrice;
      document.querySelector(".prod-details .price .saving").innerHTML = '<small>Save &pound;' + ((parseFloat(baseRecord.styles[i].skus[sk].price.previousPrice)) - (parseFloat(baseRecord.styles[0].skus[sk].price.currentPrice))).toFixed(2) + '</small>';
      document.querySelector(".prod-details .price .previous").innerHTML = 'Was &pound;' + baseRecord.styles[i].skus[sk].price.previousPrice;
      document.querySelector(".prod-details .selected-colour").innerHTML = 'Selected color: <strong>' + baseRecord.styles[i].colour + '</strong>';

      if(p) {
        /*Display colour panels*/
        var clrBar = '';
        for (var n in baseRecord.styles) {
          this.classString = n == 0 ? 'chain selected' : 'chain';
          clrBar += '<span class="' + this.classString + '" data-style-index="' + n + '">'
                 + '<span class="colour-panel" style="background-color:'+  baseRecord.styles[n].hexCode+ '" '
                 + 'title="' +  baseRecord.styles[n].colour + '"></span></span>';
        }
        document.querySelector(".prod-details .colour-picker").innerHTML = clrBar;
        /* Generate size picker */
        var opts = '';
        for (var j in baseRecord.styles[i].skus) {
          var s = baseRecord.styles[i].skus[j].size.Size ? baseRecord.styles[i].skus[j].size.Size : baseRecord.styles[i].skus[j].size['Std Dress Size'];
          s += baseRecord.styles[i].skus[j].size.Length ? ' - ' + baseRecord.styles[i].skus[j].size.Length : ''
          /*this.sizes.push(s);*/
          opts += '<option value="' + j + '">' + s + '</option>';
        }
        document.querySelector(".prod-details .size-picker").innerHTML = '<select name="size">' + opts + '</select>';
      }
      document.querySelector(".prod-details .selected-size").innerHTML = 'Selected size: <strong>' + document.querySelector(".prod-details select[name=size]").options[document.querySelector(".prod-details select[name=size]").selectedIndex].text + '</strong>';

      /* generate max quantity picker */
      var max = parseInt(baseRecord.styles[i].skus[sk].maximumPurchaseQuantity);
      opts = '';
      for (var k = 1; k <= max; k++) {
        opts += '<option value="' + k + '">' + k + '</option>';
      }
      document.querySelector(".prod-details .quantity-picker").innerHTML = '<select name="quantity">' + opts + '</select>';
      this.generateMediaQueries(i);
    } catch (err) {
      console.log(err);
    }
  },
  /**
   * Add to basket
   */
   addToCart: function () {
    try {
      var httpRequest = new XMLHttpRequest();
      if (!httpRequest) {
        throw 'Cannot create an XMLHTTP instance';
      } else {
        var data = "pid='" + (baseRecord.id).toLowerCase() + "'";
        data += "&sku_id='" +  document.querySelector(".prod-details select[name=size]").value + "'";
        data += "&quantity='" +  document.querySelector(".prod-details select[name=quantity]").value + "'";
        httpRequest.open('POST', '/basket/add', true);
        httpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(data);
        httpRequest.onreadystatechange = function() {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
            } else {

            }
          }
        };
      }
    } catch (err) {
      console.log(err);
    }
  },
  /*
   * Mount all product-related event listeners
   */
  mountEventListeners: function () {
    /* Listerner 1: Colour change */
    var clrPickers = document.querySelectorAll(".colour-picker .chain");
    for (var i = 0; i < clrPickers.length; i++) {
      clrPickers[i].addEventListener('click', function(e) {
        document.querySelector(".colour-picker .selected").classList.remove("selected");
        this.classList.add("selected");
        Product.displayDetails(this.getAttribute('data-style-index'));
      });
    }
    /* Listener 2: Size change */
    var sz = document.querySelector("select[name=size]");
    sz.addEventListener('change', function(e) {
      Product.displayDetails(document.querySelector(".colour-picker .selected").getAttribute('data-style-index'), false, sz.value);
    });
    /* Listener 3: Add to cart */
    var cart = document.querySelector(".add-to-cart button");
    cart.addEventListener('click', function(e) {
      Product.addToCart();
    });
  },
  /**
   * Update media queries in header when colour is changed
   */
  generateMediaQueries: function (i) {
    //var h = document.getElementsByTagName('head')[0];
    //if(h){h.parentNode.removeChild(h);}
    var css = "@media all and (min-width: 1200px) {.prod-details .visual {background: transparent url('" + baseRecord.styles[i].images[0].huge + "') no-repeat center/contain;}}\n";
    css += "@media (min-width: 768px) and (max-width: 1199px) {.prod-details .visual {background: transparent url('" + baseRecord.styles[i].images[0].normal + "') no-repeat center/contain;}}\n";
    css += "@media (max-width: 767px) {.prod-details .visual {background: transparent url('" + baseRecord.styles[i].images[0].small + "') no-repeat center/contain;}}\n";
    css += "@media (max-width: 480px) {.prod-details .visual {background: transparent url('" + baseRecord.styles[i].images[0].tiny + "') no-repeat center/contain;}}";
    var htmlDiv = document.createElement('div');
    htmlDiv.innerHTML = '<p>foo</p><style>' + css + '</style>';
    document.getElementsByTagName('head')[0].appendChild(htmlDiv.childNodes[1]);
  },
};

/*import Component from '../base/component';

window.onload = function(event) {
    console.log('test');
    var t = new Header();
};

class Header extends Component {

    constructor() {
        super();
        this.header = document.getElementById('header-global');
        this.header.boundingRectangle = this.header.getBoundingClientRect();
        this.lastKnownScrollPosition = window.scrollY;
        this.setWidth();
        this.addEventHandlers();
        console.log('this.header.boundingRectangle');
        console.log(this.header.boundingRectangle);
    }

    /**
     * Sets header width to match viewport width
     *
    setWidth() {
      let w = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) - (this.header.boundingRectangle.left);
      let pretendDiv = document.createElement('div');
      pretendDiv.innerHTML = '<p>foo</p><style>.header-primary{width:' + w + 'px}</style>'; // hack to inject styles into the head element
      document.getElementsByTagName('head')[0].appendChild(pretendDiv.childNodes[1]);
    }

    addEventHandlers() {
        //last_known_scroll_position = 0;
        window.addEventListener('scroll', this.scrollEventListener.bind(this), false);
    }

    scrollEventListener() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        this.headerContent = document.getElementById('header-content');
        if(currentScrollPosition > this.lastKnownScrollPosition ) {
              if (this.headerContent.classList.contains("header-content__show")) {
                  this.headerContent.classList.replace("header-content__show", "header-content__hide");
              } else {
                if (!this.headerContent.classList.contains("header-content__hide")) {
                    this.headerContent.classList.add("header-content__hide");
                }
              }
        } else if (currentScrollPosition < this.lastKnownScrollPosition) {

              if (this.headerContent.classList.contains("header-content__hide")) {
                  this.headerContent.classList.replace("header-content__hide", "header-content__show");
              } else {
                  if (!this.headerContent.classList.contains("header-content__show")) {
                      this.headerContent.classList.add("header-content__show");
                  }
              }
        }
        this.lastKnownScrollPosition = currentScrollPosition;
    }

    /**
     * Deprecated
     *
    scrollEventListenerClone() {
        let currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        console.log(currentScrollPosition);
        this.clonedHeader = document.getElementById('header-content__clone');
        if(currentScrollPosition > this.lastKnownScrollPosition || currentScrollPosition < this.header.offsetHeight) {
            if (this.clonedHeader) {
              if (this.clonedHeader.classList.contains("header-content__clone-show")) {
                  this.clonedHeader.classList.replace("header-content__clone-show", "header-content__clone-hide");
              } else {
                if (!this.clonedHeader.classList.contains("header-content__clone-hide")) {
                    this.clonedHeader.classList.add("header-content__clone-hide");
                }
              }
            }
        } else if (currentScrollPosition < this.lastKnownScrollPosition) {
          if (this.clonedHeader) {
              if (this.clonedHeader.classList.contains("header-content__clone-hide")) {
                  this.clonedHeader.classList.replace("header-content__clone-hide", "header-content__clone-show");
              } else {
                  if (!this.clonedHeader.classList.contains("header-content__clone-show")) {
                      this.clonedHeader.classList.add("header-content__clone-show");
                  }
              }
          } else {
              let clonedHeader = document.getElementById('header-content').cloneNode(true);
              clonedHeader.id = "header-content__clone";
              document.getElementsByClassName('inner-wrapper__absolute')[0].prepend(clonedHeader);
              document.getElementById('header-content__clone').classList.add("header-content__clone-show");
          }
        }
        this.lastKnownScrollPosition = currentScrollPosition;
    }
}

module.exports = Header;


/*class PatternLibraryUI {

    constructor() {
        this._initHeader();
    }

    _initHeader() {
        this.header = document.querySelector('.pattern-header');
        this.headerContent = this.header.querySelector('.pattern-header__inner-content');
        this.lastKnownScrollPosition = window.scrollY;
        this.hidden = false;
        this.visibleHeight = this.header.clientHeight + 400;
        this.aha = false;
    }

    mountEventListeners() {
        window.addEventListener('scroll', this.scrollEventListener.bind(this), false);
    }

    scrollEventListener() {
        const currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        const hideHeader = currentScrollPosition > this.lastKnownScrollPosition;
        if (this.hidden !== hideHeader) {
            this.hidden = hideHeader;
            this.headerContent.classList.toggle('pattern-header__inner-content--hide', hideHeader);
        }
        this.lastKnownScrollPosition = currentScrollPosition;
    }
}

module.exports = PatternLibraryUI;


class PatternLibraryUI {

    constructor() {
        this._initHeader();
    }
    _initHeader() {
        this.header = document.querySelector('.pattern-header');
        this.headerContent = document.querySelector('.pattern-header__inner-content');
        this.lastKnownScrollPosition = window.scrollY;
        this.hidden = false;
        this.visibleHeight = this.header.clientHeight - 30;
        this.aha = false;
    }

    mountEventListeners() {
        window.addEventListener('scroll', this.scrollEventListener.bind(this), false);
    }

    scrollEventListener() {
        const currentScrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        const hideHeader = currentScrollPosition > this.lastKnownScrollPosition;
        if(currentScrollPosition <= this.visibleHeight) {
            this.headerContent.removeAttribute("style");
            this.aha = false;
            console.log('static-pos');
        } else {
            if ((this.lastKnownScrollPosition >= this.visibleHeight) && (currentScrollPosition >= this.lastKnownScrollPosition)) {
                //this.headerContent.style.display = 'none';
                this.headerContent.removeAttribute("style");
                console.log('display-none');
            } else {
                this.aha = true;
                //this.headerContent.style.display = 'block';
                this.headerContent.style.position = 'fixed';
                if (this.hidden !== hideHeader) {
                    this.hidden = hideHeader;
                    this.headerContent.classList.toggle('pattern-header__inner-content--hide', hideHeader);
                }
                console.log('standard-tranformation');
            }
        }
        this.lastKnownScrollPosition = currentScrollPosition;
    }
}

module.exports = PatternLibraryUI;


*/
