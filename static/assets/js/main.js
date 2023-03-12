(function() {
    "use strict";


    // Spinner
    $('body').append('<div class="spinner-container" id="loadingDiv"><div class="spinnerWrap"><div class="spinner" id="spinner1"></div></div>');
    $(window).on('load', function() {
        setTimeout(removeLoader, 0);
    });

    function removeLoader() {
        $("#loadingDiv").fadeOut(250, function() {
            $("#loadingDiv").remove();
        });
    }

    $(document).ready(function() {
        let sections = select('.services', true)
        sections.forEach(section => {
            section.classList.add('d-none')
        })
        if (window.location.href.split('#')[1]) {
            $('#' + window.location.href.split('#')[1])[0].classList.remove('d-none')
        } else {
            $('#home')[0].classList.remove('d-none')
        }
    })

    $('#navbar .nav-link').click(function() {
        let navitems = select('#navbar .nav-link', true)
        let sections = select('.services', true)

        navitems.forEach(navitem => {
            navitem.classList.remove('active')
        })
        sections.forEach(section => {
            section.classList.add('d-none')
        })
        this.classList.add('active')
        $('#' + this.href.split('#')[1])[0].classList.remove('d-none')
        console.log(this.href)
        window.location.href = this.href
        if (this.href.split('#')[1].trim()) {
            document.cookie = "filter=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.reload();
        }

    })

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        if (!header.classList.contains('header-scrolled')) {
            offset -= 16
        }

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
    }

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Mobile nav toggle
     */
    on('click', '.mobile-nav-toggle', function(e) {
        select('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })

    /**
     * Mobile nav dropdowns activate
     */
    on('click', '.navbar .dropdown > a', function(e) {
        if (select('#navbar').classList.contains('navbar-mobile')) {
            e.preventDefault()
            this.nextElementSibling.classList.toggle('dropdown-active')
        }
    }, true)

    /**
     * Scrool with ofset on links with a class name .scrollto
     */
    on('click', '.scrollto', function(e) {
        if (select(this.hash)) {
            e.preventDefault()

            let navbar = select('#navbar')
            if (navbar.classList.contains('navbar-mobile')) {
                navbar.classList.remove('navbar-mobile')
                let navbarToggle = select('.mobile-nav-toggle')
                navbarToggle.classList.toggle('bi-list')
                navbarToggle.classList.toggle('bi-x')
            }
            scrollto(this.hash)
        }
    }, true)

    /**
     * Porfolio isotope and filter
     */
    window.addEventListener('load', () => {
        let portfolioContainer = select('.portfolio-container');
        if (portfolioContainer) {
            let portfolioIsotope = new Isotope(portfolioContainer, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            let portfolioFilters = select('#portfolio-flters li', true);

            on('click', '#portfolio-flters li', function(e) {
                e.preventDefault();
                portfolioFilters.forEach(function(el) {
                    el.classList.remove('filter-active');
                });
                this.classList.add('filter-active');

                portfolioIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });

            }, true);
        }

    });

    /**
     * Initiate portfolio lightbox 
     */
    const portfolioLightbox = GLightbox({
        selector: '.portfolio-lightbox'
    });

    /**
     * Portfolio details slider
     */
    new Swiper('.portfolio-details-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        }
    });

    /**
     * Scroll with ofset on page load with hash links in the url
     */
    window.addEventListener('load', () => {
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }
    });

    $(document).ready(function() {
        let cookie = check_cookie_name('filter')
        if (cookie != false) {
            cookie = JSON.parse(cookie)
            if (cookie['region'] == null) {
                cookie['region'] = 0
            }
            if (cookie['membership_type'] == null) {
                cookie['membership_type'] = 0
            }
            document.forms['filterForm']['region'].value = (cookie['region'])
            document.forms['filterForm']['memberType'].value = (cookie['membership_type'])
            document.forms['filterForm']['memberNo'].value = (cookie['member_no'])
        }
    })

    // Filter
    $('#filter #filterBtn').click(function(e) {
        e.preventDefault()
        let filterRegion, filterType, filterMno
        if (document.forms['filterForm']['region'].value.trim() == 0) {
            filterRegion = null
        } else {
            filterRegion = document.forms['filterForm']['region'].value.trim()
        }
        if (document.forms['filterForm']['memberType'].value.trim() == 0) {
            filterType = null
        } else {
            filterType = document.forms['filterForm']['memberType'].value.trim()
        }
        if (document.forms['filterForm']['memberNo'].value.trim() == '') {
            filterMno = null
        } else {
            filterMno = document.forms['filterForm']['memberNo'].value.trim()
        }
        let filter = {
            'region': filterRegion,
            'membership_type': filterType,
            'member_no': filterMno
        }
        document.cookie = "filter=" + JSON.stringify(filter)
        window.location.reload()
    })

    $('#add-record-form #renewal_status').change(function() {
        if ($('#add-record-form #renewal_status').val() == 1) {
            $('#add-record-form #renewal_date').prop('disabled', false)
            $('#add-record-form #renewal_amount').prop('disabled', false)
        } else {
            $('#add-record-form #renewal_date').val('')
            $('#add-record-form #renewal_date').prop('disabled', true)
            $('#add-record-form #renewal_amount').val('')
            $('#add-record-form #renewal_amount').prop('disabled', true)
        }
    })

    $('#edit-record-form #Urenewal_status').change(function() {
        if ($('#edit-record-form #Urenewal_status').val() == 1) {
            $('#edit-record-form #Urenewal_date').prop('readonly', false)
            $('#edit-record-form #Urenewal_amount').prop('readonly', false)
        } else {
            $('#edit-record-form #Urenewal_date').val('')
            $('#edit-record-form #Urenewal_date').prop('readonly', true)
            $('#edit-record-form #Urenewal_amount').val('')
            $('#edit-record-form #Urenewal_amount').prop('readonly', true)
        }
    })

    // // View all records
    // $('table').click(function() {
    //     $('.overlay-view').removeClass('d-none')
    // })

    // To add new record
    $('#home button#add-new-record-btn').click(function(e) {
        e.preventDefault();
        $('.overlay-add-form').removeClass('d-none');
    });

    $('#add-record-form .cancel-dept-btn').click(function(e) {
        e.preventDefault();
        $('#add-record-form').trigger('reset')
        $('.overlay-add-form').addClass('d-none');
    });

    // To edit record
    $('#home .table button.edit-form').click(function(e) {
        e.preventDefault();
        $('#home .overlay-edit-form').removeClass('d-none');
        console.log($(this).parents('tr').children());
        document.forms['edit-record-form']['fno'].value = $(this).parents('tr').children().first().text().trim();
        document.forms['edit-record-form']['mno'].value = $(this).parents('tr').children().eq(1).text().trim();
        // document.forms['edit-record-form']['type'].value = $(this).parents('tr').children().eq(2).text().trim();
        document.forms['edit-record-form']['cnm'].value = $(this).parents('tr').children().eq(4).text().trim();
        document.forms['edit-record-form']['mnm'].value = $(this).parents('tr').children().eq(3).text().trim();
        document.forms['edit-record-form']['contact'].value = $(this).parents('tr').children().eq(5).text().trim();
        document.forms['edit-record-form']['email'].value = $(this).parents('tr').children().eq(6).text().trim();
        document.forms['edit-record-form']['address'].value = $(this).parents('tr').children().eq(7).text().trim();
        let mydate = $(this).parents('tr').children().eq(8).text().trim().split(' ')[0]
        document.forms['edit-record-form']['dob'].value = mydate;
        document.forms['edit-record-form']['category'].value = $(this).parents('tr').children().eq(9).text().trim();
        // console.log($(this).parents('tr').children().eq(9).text().trim())
        document.forms['edit-record-form']['region'].value = $(this).parents('tr').children().eq(10).text().trim();
        let mdate = $(this).parents('tr').children().eq(11).text().trim().split(' ')[0]
        document.forms['edit-record-form']['membership_date'].value = mdate;
        if ($(this).parents('tr').children().eq(12).text().trim() == 'False') {
            document.forms['edit-record-form']['renewal_status'].value = 0;
        } else {
            document.forms['edit-record-form']['renewal_status'].value = 1;
        }
        let rdate = $(this).parents('tr').children().eq(13).text().trim().split(' ')[0]
        document.forms['edit-record-form']['renewal_date'].value = rdate
        document.forms['edit-record-form']['renewal_amount'].value = $(this).parents('tr').children().eq(14).text().trim();

    });
    // To edit record
    $('#home .table button.mg-edit-form').click(function(e) {
        e.preventDefault();
        // console.log($(this).parents('tr').children());
        $('#home .overlay-edit-form').removeClass('d-none');
        document.forms['edit-record-form']['fno'].value = $(this).parents('tr').children().first().text().trim();
        document.forms['edit-record-form']['mno'].value = $(this).parents('tr').children().eq(1).text().trim();
        document.forms['edit-record-form']['cnm'].value = $(this).parents('tr').children().eq(4).text().trim();
        document.forms['edit-record-form']['contact'].value = $(this).parents('tr').children().eq(5).text().trim();
        document.forms['edit-record-form']['address'].value = $(this).parents('tr').children().eq(7).text().trim();
        let mydate = $(this).parents('tr').children().eq(8).text().trim().split(' ')[0]
        document.forms['edit-record-form']['dob'].value = mydate;
        document.forms['edit-record-form']['region'].value = $(this).parents('tr').children().eq(10).text().trim();
        if ($(this).parents('tr').children().eq(12).text().trim() == 'False') {
            document.forms['edit-record-form']['renewal_status'].value = 0;
        } else {
            document.forms['edit-record-form']['renewal_status'].value = 1;
        }
        let rdate = $(this).parents('tr').children().eq(13).text().trim().split(' ')[0]
        document.forms['edit-record-form']['renewal_date'].value = rdate
        document.forms['edit-record-form']['renewal_amount'].value = $(this).parents('tr').children().eq(14).text().trim();

    });

    $('#edit-record-form .add-dept-btn').click(function(e) {
        e.preventDefault()
        $('#edit-record-form').submit()

    })
    $('#edit-record-form .cancel-dept-btn').click(function(e) {
        e.preventDefault();
        $('#edit-record-form').trigger('reset')
        $('#home .overlay-edit-form').addClass('d-none');
    });

    // To delete record
    $('#home .table button.delete-record').click(function(e) {
        e.preventDefault();
        document.forms['DDForm']['id'].value = $(this).parents('tr').children().eq(1).text().trim()
        $('#home .overlay-delete-record .delete-mno').text("Member No. : " + $(this).parents('tr').children().eq(1).text().trim())
        $('#home .overlay-delete-record').removeClass('d-none');
    });

    $('#home .overlay-delete-record button.confirm-delete').click(function() {
        $('#home .overlay-delete-record').addClass('d-none');
        $('#DDForm').submit()
    });

    $('#home .overlay-delete-record button.cancel-delete').click(function(e) {
        e.preventDefault();
        $('#home .overlay-delete-record').addClass('d-none');
    });

    // To update manager record
    $('#addManager .table button.edit-form').click(function(e) {
        e.preventDefault();
        $('#addManager .overlay-edit-form').removeClass('d-none');
        document.forms['editManagerForm']['mid'].value = $(this).parents('tr').children().eq(1).text().trim();
        document.forms['editManagerForm']['name'].value = $(this).parents('tr').children().eq(2).text().trim();
        document.forms['editManagerForm']['email'].value = $(this).parents('tr').children().eq(3).text().trim();
        document.forms['editManagerForm']['mobile'].value = $(this).parents('tr').children().eq(4).text().trim();
        console.log($(this).parents('tr').children().eq(5).text().trim().split(', '))
        let regions = $(this).parents('tr').children().eq(5).text().trim().split(', ')
        regions.forEach(region => {
            document.forms['editManagerForm']['region'].forEach(checkbox => {
                if (checkbox.value == region) {
                    checkbox.checked = true
                }
            });
            document.forms['editManagerForm']['region'].value = region;
        });
        console.log(document.forms['editManagerForm']['region'])
        document.forms['editManagerForm']['downloadable'].value = $(this).parents('tr').children().eq(6).text().trim() == 'True' ? 'Yes' : 'No';
    });

    $('#editManagerForm .editManagerbtn').click(function(e) {
        e.preventDefault()
    })
    $('#editManagerForm .cancelManagerBtn').click(function(e) {
        e.preventDefault();
        $('#editManagerForm').trigger('reset')
        $('#addManager .overlay-edit-form').addClass('d-none');
    });

    // To delete manager record
    $('#addManager .table button.delete-record').click(function(e) {
        e.preventDefault();
        $('#addManager .overlay-delete-record').removeClass('d-none');
        document.forms['DDForm']['id'].value = $(this).parents('tr').children().first().text().trim();
    });

    $('#addManager .overlay-delete-record #delete-manager').click(function(e) {
        e.preventDefault()
        $('#addManager .overlay-delete-record').addClass('d-none');
        window.location.href = ('admin/deleteManager/' + document.forms['DDForm']['id'].value)
    });

    $('#addManager .overlay-delete-record button.cancel-delete').click(function(e) {
        e.preventDefault();
        alert()
        $('#addManager .overlay-delete-record').addClass('d-none');

    });

    // $("#addManagerForm .addManagerBtn").click(function(e) {
    //     e.preventDefault()
    //     $.ajax({
    //         url: "{{url_for('admin/addManager')}}",
    //         contentType: 'application/json;charset=UTF-8',
    //         type: 'POST',
    //         success: function() {
    //             alert()
    //         }
    //     });
    // });

    // To logout user
    $('header .logout').click(function() {
        if (confirm("Click OK to Logout !!")) {

            document.cookie = "loggeduser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.reload()
        }
    })

})()

function check_cookie_name(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        return false
    }
}

$('.alert button').click(function() {
    $.ajax({
        type: "POST",
        url: "/removeAlert",
        success: function(response) {
            // alert()
        }
    });
})