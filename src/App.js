import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import React, { Component } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { categories } from './categories.json'
import { products } from './products.json'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      filterAvailability: null,
      filterPrice: null,
      filterStock: null,
      orderOption: null,
      shoppingCartItems: localStorage,
      showSearchBar: false,
      searchValue: null,
      products: products
    }
  }

  convertOnNumber = (e) => {
    return parseInt(e.replace(/[^0-9]/g, ''))
  }

  filterByCategory = (id, hasSublevels) => {
    this.setState({
      products: id ? products.filter(i => i.sublevel_id === id) : products,
      showSearchBar: !hasSublevels ? true : false,
      searchValue: hasSublevels ? null : ''
    })
  }

  filterByAvailability = (products) => {
    let { filterAvailability } = this.state
    switch (filterAvailability) {
      case 1:
        return products.filter(p => p.available)
      case 2:
        return products.filter(p => !p.available)
      default:
        return products
    }
  }

  filterByPrice = (products) => {
    let { filterPrice } = this.state
    switch (filterPrice) {
      case 1:
        return products.filter(p => this.convertOnNumber(p.price) < 5000)
      case 2:
        return products.filter(p => (this.convertOnNumber(p.price) >= 5000) && (this.convertOnNumber(p.price) < 10000))
      case 3:
        return products.filter(p => this.convertOnNumber(p.price) >= 10000)
      default:
        return products
    }
  }

  filterByStock = (products) => {
    let { filterStock } = this.state
    switch (filterStock) {
      case 1:
        return products.filter(p => p.quantity === 0)
      case 2:
        return products.filter(p => p.quantity !== 0)
      default:
        return products
    }
  }

  productFilter = (products) => {
    return this.filterByStock(this.filterByPrice(this.filterByAvailability(products)))
  }

  productSort = (products) => {
    let { orderOption } = this.state
    switch (orderOption) {
      case 1:
        return products.sort((a, b) => this.convertOnNumber(a.price) - this.convertOnNumber(b.price))
      case 2:
        return products.sort(p => p.available ? -1 : 1)
      case 3:
        return products.sort((a, b) => a.quantity - b.quantity)
      default:
        return products
    }
  }

  filterSearch = (products) => {
    let { searchValue } = this.state
    if (searchValue === null || searchValue === '') {
      return products
    } else {
      return products.filter(p => p.name.includes(searchValue))
    }
  }

  storeProduct = (product) => {
    localStorage.setItem(product.id, JSON.stringify(product))
    this.setState({ shoppingCartItems: localStorage })
  }

  deleteItem = (product) => {
    localStorage.removeItem(product)
    this.setState({ shoppingCartItems: localStorage })
  }

  renderCategories = (categories) => {
    return (
      <ul className="list-group">
        {
          categories.map(i => {
            return (
              <li className="list-group-item sb" key={i.id}>
                {i.sublevels ? (
                  <>
                    <a className='sb-item' data-toggle='collapse' href={`#c${i.id}`} id={i.id} role='button' aria-expanded="false" aria-controls={`c${i.id}`} onClick={() => this.filterByCategory(i.id, true)}>
                      {i.name}
                      <FontAwesomeIcon className='ml-2' icon={faChevronDown} />
                    </a>
                    <div className='collapse' id={`c${i.id}`} >
                      {this.renderCategories(i.sublevels)}
                    </div>
                  </>
                ) : (
                    <>
                      <a href={`#c${i.id}`} id={i.id} role='button' onClick={() => this.filterByCategory(i.id, false)}>
                        {i.name}
                      </a>
                    </>
                  )}
              </li>
            )
          })
        }
      </ul>
    )
  }

  renderFilters = () => {
    return (
      <ul className='list-group'>
        <li className='list-group-item sb'>
          <a className='sb-item' data-toggle='collapse' href='#availability' role='button' aria-expanded='false' aria-controls='availability'>
            Disponibilidad
            <FontAwesomeIcon className='ml-2' icon={faChevronDown} />
          </a>
          <div className='collapse' id='availability'>
            <ul className='list-group'>
              <li className='list-group-item sb'>
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" name='av' id="anyavailable" value='none' onChange={() => this.setState({ filterAvailability: 0 })}></input>
                  <label className="custom-control-label" htmlFor="anyavailable">No filtrar</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" name='av' id="available" value='false' onChange={() => this.setState({ filterAvailability: 1 })}></input>
                  <label className="custom-control-label" htmlFor="available">Disponible</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" name='av' id="noavailable" value='true' onChange={() => this.setState({ filterAvailability: 2 })}></input>
                  <label className="custom-control-label" htmlFor="noavailable">No Disponible</label>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className='list-group-item sb'>
          <a className='sb-item' data-toggle='collapse' href='#price' role='button' aria-expanded='false' aria-controls='price'>
            Precio
            <FontAwesomeIcon className='ml-2' icon={faChevronDown} />
          </a>
          <div className='collapse' id='price'>
            <ul className='list-group'>
              <li className='list-group-item sb'>
                <div className='custom-control custom-radio'>
                  <input type='radio' className='custom-control-input' name='pr' id='anyPrice' value='any' onChange={() => this.setState({ filterPrice: 0 })}></input>
                  <label className='custom-control-label' htmlFor='anyPrice'>Cualquier precio</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div className='custom-control custom-radio'>
                  <input type='radio' className='custom-control-input' name='pr' id='less-5000' value='l-5000' onChange={() => this.setState({ filterPrice: 1 })}></input>
                  <label className='custom-control-label' htmlFor='less-5000'>Menos de $5,000</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div className='custom-control custom-radio'>
                  <input type='radio' className='custom-control-input' name='pr' id='5000-to-10000' value='50000-10000' onChange={() => this.setState({ filterPrice: 2 })}></input>
                  <label className='custom-control-label' htmlFor='5000-to-10000'>$5,000 - $10,000</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div className='custom-control custom-radio'>
                  <input type='radio' className='custom-control-input' name='pr' id='more-10000' value='m-10000' onChange={() => this.setState({ filterPrice: 3 })}></input>
                  <label className='custom-control-label' htmlFor='more-10000'>Mas de  $10,000</label>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className='list-group-item sb'>
          <a className='sb-item' data-toggle='collapse' href='#stock' role='button' aria-expanded='false' aria-controls='stock'>
            Cantidad
            <FontAwesomeIcon className='ml-2' icon={faChevronDown} />
          </a>
          <div className='collapse' id='stock'>
            <ul className='list-group'>
              <li className='list-group-item sb'>
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" name='stk' id="anystock" value='any' onChange={() => this.setState({ filterStock: 0 })}></input>
                  <label className="custom-control-label" htmlFor="anystock">No filtrar</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" name='stk' id="nostock" value='no' onChange={() => this.setState({ filterStock: 1 })}></input>
                  <label className="custom-control-label" htmlFor="nostock">Sin cantidad disponible</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div className="custom-control custom-radio">
                  <input type="radio" className="custom-control-input" name='stk' id="withstock" value='yes' onChange={() => this.setState({ filterStock: 2 })}></input>
                  <label className="custom-control-label" htmlFor="withstock">Con cantidad disponible</label>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    )
  }

  renderSorts = () => {
    return (
      <ul className='list-group'>
        <li className='list-group-item sb'>
          <div className='custom-control custom-radio'>
            <input type='radio' className='custom-control-input' name='sort' id='none' value='none' onChange={() => this.setState({ orderOption: 0 })}></input>
            <label className='custom-control-label' htmlFor='none'>No ordenar</label>
          </div>
        </li>
        <li className='list-group-item sb'>
          <div className='custom-control custom-radio'>
            <input type='radio' className='custom-control-input' name='sort' id='sortPrice' value='price' onChange={() => this.setState({ orderOption: 1 })}></input>
            <label className='custom-control-label' htmlFor='sortPrice'>Precio</label>
          </div>
        </li>
        <li className='list-group-item sb'>
          <div className='custom-control custom-radio'>
            <input type='radio' className='custom-control-input' name='sort' id='sortAvailability' value='available' onChange={() => this.setState({ orderOption: 2 })}></input>
            <label className='custom-control-label' htmlFor='sortAvailability'>Disponibilidad</label>
          </div>
        </li>
        <li className='list-group-item sb'>
          <div className='custom-control custom-radio'>
            <input type='radio' className='custom-control-input' name='sort' id='sortQuantity' value='quantity' onChange={() => this.setState({ orderOption: 3 })}></input>
            <label className='custom-control-label' htmlFor='sortQuantity'>Cantidad</label>
          </div>
        </li>
      </ul>
    )
  }

  renderProducts = (products) => {
    return this.filterSearch(this.productSort(this.productFilter(products)))
      .map(p => {
        var opts = {}
        if (!p.available) {
          opts['disabled'] = 'disabled'
        }
        return (
          <div className='col-md-4' key={p.id}>
            <div className='card text-center'>
              <div className='card-body'>
                <h5 className='card-title product-name'>{p.name}</h5>
                <h6 className='card-subtitle mb-2 text-muted'>{p.price}</h6>
                <p className='card-text'>Cantidad: {p.quantity}</p>
                <p className={`card-text ${!p.available ? 'no-available' : null}`}>{p.available ? 'Disponible' : 'No Disponible'}</p>
                <button type='button' className='btn btn-success d-flex float-right align-items-center' {...opts} onClick={() => this.storeProduct(p)}>
                  <div className='add'>Añadir al carrito</div>
                  <FontAwesomeIcon icon={faShoppingCart} />
                </button>
              </div>
            </div>
          </div>
        )
      })
  }

  renderShoppingCart = () => {
    let shoppingCart = []
    let { shoppingCartItems } = this.state
    shoppingCartItems.length !== 0 ? (
      Object.values(shoppingCartItems).forEach(i => {
        var item = JSON.parse(i)
        shoppingCart.push(
          <ul className='list-group mb-2' key={item.id}>
            <li className='list-group-item sci'>
              <div className='d-inline proof'>
                <h6 className='d-inline mr-1'><b className='sc-title'>Nombre:</b></h6>
                <p className='d-inline mr-3'>{item.name}</p>
                <h6 className='d-inline mr-1'><b className='sc-title'>Precio:</b></h6>
                <p className='d-inline mr-3'>{item.price}</p>
                <h6 className='d-inline mr-1 sc-title'>{item.quantity} Unidades</h6>
                <div className='form-inline mb-1'>
                  <label htmlFor='quantity' className='col-form-label sc-title'><b>Cantidad a comprar:</b></label>
                  <input id='quantity' className='form-control ml-2' type='number' name='quantity' defaultValue='1' min='1' max={item.quantity} onChange={e => e.preventDefault()}></input>
                </div>
              </div>
              <button className='btn btn-danger float-right ml-2' onClick={() => this.deleteItem(item.id)}>Eliminar</button>
              <button className='btn btn-success float-right ml-2' onClick={() => this.deleteItem(item.id)}>Comprar</button>
            </li>
          </ul>
        )
      })
    ) : (
        shoppingCart.push(
          <h6 key='noItems'>No tienes productos en el carrito</h6>
        )
      )
    return shoppingCart
  }

  render() {
    let products = [...this.state.products]
    const { showSearchBar } = this.state
    return (
      <>
        <header className="navbar navbar-expand-md navbar-dark flex-column flex-md-row justify-content-between" id='bd-navbar'>
          <div className="container-fluid">
            <span className="navbar-brand" id='logo'>El baratón</span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#shoppingCar" aria-controls="shoppingCar" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="shoppingCar">
              <ul className='nav navbar-nav ml-auto align-items-center'>
                {showSearchBar && (
                  <li className='mbr'>
                    <form class="form-inline mr-3">
                      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={this.state.searchValue} onChange={(e) => this.setState({ searchValue: e.target.value })}></input>
                    </form>
                  </li>
                )}
                <li>
                  <button type='button' className='btn' data-toggle='modal' data-target='#modalShoppingCart' id="button">
                    <FontAwesomeIcon icon={faShoppingCart} size='2x' />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <div className='container-fluid'>
          <div className="row flex-xl-nowrap">
            <div className="col-12 col-md-4 col-lg-3" id="sidebar">
              <div className='sb-links'>
                <ul className='list-group hdul'>
                  <li className='list-group-item sb'>
                    <a className='sb-item hd' data-toggle='collapse' href='#categories' id='cat' role='button' aria-expanded='false' onClick={() => this.filterByCategory()}>
                      Categorías
                      <FontAwesomeIcon className='ml-2' icon={faChevronDown} />
                    </a>
                    <div className='collapse show' id='categories'>
                      {this.renderCategories(categories)}
                    </div>
                  </li>
                  <li className='list-group-item sb'>
                    <a className='sb-item hd' data-toggle='collapse' href='#filters' id='filt' role='button' aria-expanded='false' aria-controls='filters'>
                      Filtros
                      <FontAwesomeIcon className='ml-2' icon={faChevronDown} />
                    </a>
                    <div className='collapse show' id='filters'>
                      {this.renderFilters()}
                    </div>
                  </li>
                  <li className='list-group-item sb'>
                    <a className='sb-item hd' data-toggle='collapse' href='#sorts' id='order' role='button' aria-expanded='false' aria-controls='sorts'>
                      Ordenar Por
                      <FontAwesomeIcon className='ml-2' icon={faChevronDown} />
                    </a>
                    <div className='collapse show' id='sorts'>
                      {this.renderSorts()}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <main role="main" className="col-12 col-md-8 ml-sm-auto col-lg-9 px-4 content">
              <div className='row mt-3'>
                {this.renderProducts(products)}
              </div>
            </main>
          </div>
        </div>

        <div className="modal fade" id="modalShoppingCart" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Carrito de Compras</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {this.renderShoppingCart()}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default App;
