const Router = {
  init: () => {
    document.querySelectorAll('a.navlink').forEach((a) => {
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        Router.go(href);
        console.log(event);
      });
    });
    // It listen for history changes
    window.addEventListener('popstate', (event) => {
      Router.go(event.state.route, false);
      console.log(event);
    });
    // Process initial URL
    Router.go(location.pathname);
  },
  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState({ route }, '', route);
    }
    console.log(route);
    document
      .querySelectorAll('section.page')
      .forEach((s) => (s.style.display = 'none'));
    if (route === '/') {
      document.querySelector('section#home').style.display = 'block';
      return;
    }
    if (route.includes('/details')) {
      document.querySelector('section#details').style.display = 'block';
      return;
    }
    if (route === '/styleguide') {
      document.querySelector('section#styleguide').style.display = 'block';
    }

    window.scrollX = 0;
  },
};

window.Router = Router; // make it "public"
export default Router;
