/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Link from '../Link';
import Navigation from '../Navigation';

class Header extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation className={s.nav} />
          <Link className={s.brand} to="/">
            <img src="https://d30y9cdsu7xlg0.cloudfront.net/png/303464-84.png" width="38" height="38" alt="React" />
            <span className={s.brandTxt}>IBU</span>
          </Link>
          <div className={s.banner}>
            <h1 className={s.bannerTitle}>Ingestion Batch Utility</h1>
            <p className={s.bannerDesc}>Automating, validating Objects and ingestion</p>
          </div>
        </div>
      </div>
    );
  }

}

export default withStyles(Header, s);
