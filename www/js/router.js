// extends https://github.com/BusinessDuck/html5-history-router

class Router {
  routes = [];
  options;
  alwaysFunc;
  _resolving;
  _resolver;
  _prevUrl;
  _prevState;
  _subscribed;
  _listener;

  /**
   * Creates an instance of Router.
   */
  constructor(options) {
    this.routes = [];
    this.options = Object.assign(
      {
        debug: false,
      },
      options,
    );
    this.always(() => null);
    this._listener = () => this._onLocationChange(false);
    this._subscribe();
    this.resolve();
    window.addEventListener('DOMContentLoaded', this._listener);
  }

  /**
   * Dispose router
   */
  dispose() {
    this._prevState = null;
    this._prevUrl = null;
    this._unsubscribe();
  }

  /**
   * Sync current route with router
   * !NB: Use it after external location or history change
   */
  applyState() {
    this._saveState(document.location.pathname, history.state);
    return this._onLocationChange(true);
  }

  /**
   * Push route state to history stack
   */
  pushState(url = '/', state = {}) {
    url = '/#' + url
    if (!state.reverted) {
      this._saveState(document.location.pathname, history.state);
    }
    if (url !== location.pathname) {
      history.pushState(state, document.title, url);
    } else {
      history.replaceState(state, document.title, url);
    }
    if (this._resolving) {
      return Promise.resolve(false);
    }
    return this._onLocationChange();
  }

  /**
   * Pop state from history stack
   */
  popState() {
    history.back();
  }

  /**
   * Replace current url to new with state
   */
  replaceState(url = '/', state = {}) {
    history.replaceState(state, document.title, url);
    return this._onLocationChange();
  }

  /**
   * Resolve route
   */
  resolve(handler = () => Promise.resolve(true)) {
    this._resolver = handler;
    return this;
  }

  /**
   * Attach route with handler
   */
  on(route, handler) {
    this.routes.push({
      route,
      handler,
    });
    return this;
  }

  /**
   *  Default route fallback
   */
  default(handler) {
    this.routes.push({
      route: '',
      handler,
    });
    return this;
  }

  /**
   * Every route change callback
   */
  always(func) {
    this.alwaysFunc = func;
    return this;
  }

  /**
   * Parse route by regexp or route mask
   */
  _getRouteParser(route) {
    const paramNames = [];
    let regexp;
    if (route instanceof RegExp) {
      regexp = route;
    } else {
      const expression = route
        .replace(/([:*])(\w+)/g, (full, dots, name) => {
          paramNames.push(name);
          return '([^/]+)';
        })
        .replace(/\*/g, '(?:.*)');
      regexp = new RegExp(`${expression}(?:/$|$)`);
    }
    return {
      paramNames,
      regexp,
    };
  }

  /**
   * Collect route params from matches founded in route path
   */
  _collectRouteParams(match, paramNames) {
    return match.slice(1, match.length).reduce((params, value, index) => {
      params[paramNames[index]] = decodeURIComponent(value);
      return params;
    }, {});
  }

  /**
   * Location change callback
   */
  _onLocationChange(applied) {
    //const path = decodeURI(location.pathname);
    var path = decodeURI(location.hash)
    if(path && /^#/.test(path)){
      path = path.slice(1)
    }
    // Resolve already in progress
    if (this._resolving) {
      return this._resolving;
    }
    this._resolving = this._resolver(this._prevUrl, path).then((result) => {
      if (result) {
        this._resolving = null;
        return this._resolveLocation(path, history.state, applied);
      } else {
        return this._revertState().then(() => {
          this._resolving = null;
          return result;
        });
      }
    });
    return this._resolving;
  }

  /**
   * Revert state to previous saved
   */
  _revertState() {
    // First loaded state
    if (!this._prevUrl) {
      this.popState();
      return Promise.resolve(true);
    }
    // remove forward button
    return this.pushState<RouterState>(this._prevUrl, { ...this._prevState, reverted: true });
  }

  /**
   * Resolve location
   */
  _resolveLocation(path, state, applied) {
    this._handleRoutes(path, state, applied);
    this._saveState(path, state);

    this.alwaysFunc(path);
    return Promise.resolve(true);
  }

  /**
   * Apply routes handler to current route
   */
  _handleRoutes(path, state, applied) {
    for (let i = 0; i < this.routes.length; i++) {
      const parser = this._getRouteParser(this.routes[i].route);
      const match = path.match(parser.regexp);
      if (match) {
        const params = this._collectRouteParams(match, parser.paramNames);
        this.routes[i].handler.call(null, {
          path,
          state,
          params,
          applied,
        });
        break;
      }
    }
  }

  /**
   * Subscribe browser events
   */
  _subscribe() {
    if (!this._subscribed) {
      window.addEventListener('popstate', this._listener);
      this._subscribed = true;
    }
  }

  /**
   * Unsubscribe browser popstate
   */
  _unsubscribe() {
    if (this._subscribed) {
      window.removeEventListener('popstate', this._listener);
      this._subscribed = false;
    }
  }

  /**
   * Save last handled state of route
   */
  _saveState(url, state) {
    this._prevUrl = url;
    this._prevState = state;
  }
}