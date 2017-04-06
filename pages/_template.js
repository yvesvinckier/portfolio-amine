import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import getPageTitle from 'src/utils/get-page-title'
import getChildrenPage from 'src/utils/get-children-page'
import getPagesAssets from 'src/utils/get-pages-assets'
import getProjectsData from 'src/utils/get-projects-data'
import passDataToChildren from 'src/utils/pass-data-to-children'
import isProjectPage from 'src/utils/is-project-page'
import Header from 'src/components/Header'
import Container from 'src/components/Container'
import Loader from 'src/components/Loader'

// Inject global styles.
import 'src/sass/vendors/_normalize.scss'
import 'src/sass/base/_root.scss'

class Template extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    route: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      assetsReady: false,
      previousPath: '',
      projectsData: getProjectsData(props.route.pages)
    }
  }

  componentWillReceiveProps () {
    // We store the previous path before it changes so that we can pass it down to the child page.
    this.setState({ previousPath: this.props.location.pathname })
  }

  render () {
    const { previousPath, assetsReady, projectsData } = this.state
    const { children, route } = this.props
    const childrenPage = getChildrenPage(children)
    const { skipLoader, needsRootData, hideHeader } = childrenPage.data

    const content = needsRootData
      ? passDataToChildren(children, { previousPath, projectsData })
      : children
    const loader = (
      <Loader
        assets={getPagesAssets(route.pages)}
        onReady={() => this.setState({ assetsReady: true })}
      />
    )

    return (
      <div>
        <Helmet
          title={getPageTitle()}
        />

        {!hideHeader && <Header showCloseButton={isProjectPage(childrenPage)} />}

        <Container>
          {(assetsReady || skipLoader) ? content : loader}
        </Container>
      </div>
    )
  }
}

export default Template
