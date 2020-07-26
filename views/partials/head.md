 <nav class="nav nav-wrapper black mb-m">
        <div class="container">
            <a href="#" class="brand-logo">Photo Ninja</a>
            <a href="" class="sidenav-trigger right" data-target="mobile-menu">
                <i class="material-icons">menu</i>
            </a>
            <ul class="right hide-on-med-and-down">
                <li><a href="#photo">Home</a></li>
                <li><a href="#services">NewsFeed</a></li>
                <li><a href="#contact">Contact</a></li>
                <% if(locals.user) { %>
                    <li id="logout"><a href="#">logout</a></li>
                    <%  }else{ %>
                        <li>
                            <a href="/users/login">login</a>
                        </li>
                        <% } %>

            </ul>
    </nav>
