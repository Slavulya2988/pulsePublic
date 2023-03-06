import { tns } from 'tiny-slider';
import $ from 'jquery';
import jQuery from 'jquery-validation';
import Inputmask from "inputmask";

const slider = tns({
    container: '.carousel__inner',
    items: 1,
    slideBy: 'page',
    autoplay: false,
    controls: false,
    nav: false
});

document.querySelector('.prev').addEventListener('click', () => slider.goTo('prev'));
document.querySelector('.next').addEventListener('click', () => slider.goTo('next'));


function tabs() {
    const tabs = document.querySelectorAll('.catalog__tab'),
        contentTabs = document.querySelectorAll('.catalog__content');

    function removeClassActive(element, classActive) {
        element.forEach(item => {
            item.classList.remove(classActive);
        });
    }

    removeClassActive(tabs, 'catalog__tab_active');
    removeClassActive(contentTabs, 'catalog__content_active');


    tabs[0].classList.add('catalog__tab_active');
    contentTabs[0].classList.add('catalog__content_active');


    tabs.forEach((item, i) => {

        item.addEventListener('click', (e) => {
            removeClassActive(tabs, 'catalog__tab_active');
            removeClassActive(contentTabs, 'catalog__content_active');

            if (e.target.parentElement == item) {
                item.classList.add('catalog__tab_active');
                contentTabs[i].classList.add('catalog__content_active');
            }

        });
    });

}

tabs();

function toggleSlideJS(itemsClass) {
    const
        links = document.querySelectorAll(itemsClass),
        content = document.querySelectorAll('.catalog-item__content'),
        list = document.querySelectorAll('.catalog-item__list');


    links.forEach((link, i) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.target == link) {
                content[i].classList.toggle('catalog-item__content_active');
                list[i].classList.toggle('catalog-item__list_active');
            }
        });
    });
}
toggleSlideJS('.catalog-item__link');
toggleSlideJS('.catalog-item__back');

// modal
function showModal() {
    const
        modalButoon = document.querySelectorAll('[data-modal=consultation]'),
        buttonMini = document.querySelectorAll('.button_mini'),


        modalConsultation = document.querySelector('#consultation'),
        modalOrder = document.querySelector('#order'),
        modalDescr = modalOrder.querySelector('.modal__descr'),

        overlay = document.querySelector('.overlay'),
        modalClose = document.querySelectorAll('.modal__close'),

        titles = document.querySelectorAll('.catalog-item__subtitle')
        ;

    modalButoon.forEach(item => {
        item.addEventListener('click', (e) => {

            overlay.style.display = 'block';
            modalConsultation.style.display = 'block';

        });
    });

    buttonMini.forEach((item, i) => {
        item.addEventListener('click', () => {
            // console.log(titles[i].textContent);
            modalDescr.textContent = titles[i].textContent;
            overlay.style.display = 'block';
            modalOrder.style.display = 'block';

        });
    });

    modalClose.forEach(item => {
        item.addEventListener('click', () => {
            overlay.style.display = '';
            modalConsultation.style.display = '';
            modalOrder.style.display = '';
        });
    });
}

showModal();
// Smooth scror and pageup
$(window).on("scroll", function () {
    if ($(this).scrollTop() > 1600) {
        $('.pageup').fadeIn();
    } else {
        $('.pageup').fadeOut();
    }
});

//плавний перехід на верх сторинки
$("a[href=#up]").on('click', function () {
    const _href = $(this).attr("href");
    $("html, body").animate({ scrollTop: $(_href).offset().top + "px" });
    return false;
});
// validation

function validateForm(form) {
    $(form).validate({
        rules: {
            name: {
                required: true,
                minlength: 2
            },
            phone: "required",
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: {
                required: "Будь ласка, вкажіть своє ім'я",
                minlength: jQuery.validator.format("Повинно бути не меньш {0} символів!")
            },
            phone: "Вкажить свій номер телефону",
            email: {
                required: "Нам потрібна ваша електронна адреса, щоб зв'язатися з вами",
                email: "Ваша електронна адреса має бути у форматі name@domain.com"
            }
        }
    });
}

validateForm('#consultation-form');
validateForm('#order form');
validateForm('#consultation form');

//форматна маска для поля телефон
const selector = document.querySelectorAll('[name="phone"]');
const im = new Inputmask("+ 3 (999) 99-99-999");
selector.forEach(item => {
    im.mask(item);
});


// відправка повідомлення поштою
$('form').on('submit', function (e) {
    e.preventDefault();

    if (!$(this).valid()) {
        return;
    }

    $.ajax({
        type: "POST",
        url: "mailer/smart.php",
        data: $(this).serialize()
    }).done(function () {
        $(this).finf("input").val("");
        $('#consultation, #order').fadeOut();
        $('.overlay, #thanks').fadeIn('slow');

        $('form').trigger('reset');
    });
    return false;
});
