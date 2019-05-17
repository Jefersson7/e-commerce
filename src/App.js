import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import React, { Component } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faChevronDown, faPlus } from '@fortawesome/free-solid-svg-icons'
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
      products: products
    }
  }

  convertOnNumber = (e) => {
    return parseInt(e.replace(/[^0-9]/g, ''))
  }

  filterByCategory = (id) => {
    this.setState({
      products: id ? products.filter(i => i.sublevel_id === id) : products
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
                    <a className='sb-item' data-toggle='collapse' href={`#c${i.id}`} id={i.id} role='button' aria-expanded="false" aria-controls={`c${i.id}`} onClick={() => this.filterByCategory(i.id)}>
                      {i.name}
                    </a>
                    <FontAwesomeIcon icon={faChevronDown} />
                    <div className='collapse' id={`c${i.id}`} >
                      {this.renderCategories(i.sublevels)}
                    </div>
                  </>
                ) : (
                    <>
                      <a href={`#c${i.id}`} id={i.id} role='button' onClick={() => this.filterByCategory(i.id)}>
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
          </a>
          <FontAwesomeIcon icon={faChevronDown} />
          <div className='collapse' id='availability'>
            <ul className='list-group'>
              <li className='list-group-item sb'>
                <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" name='av' id="available" value='false' onChange={() => this.setState({ filterAvailability: 1 })}></input>
                  <label class="custom-control-label" for="available">Disponible</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" name='av' id="noavailable" value='true' onChange={() => this.setState({ filterAvailability: 2 })}></input>
                  <label class="custom-control-label" for="noavailable">No Disponible</label>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className='list-group-item sb'>
          <a className='sb-item' data-toggle='collapse' href='#price' role='button' aria-expanded='false' aria-controls='price'>
            Precio
          </a>
          <FontAwesomeIcon icon={faChevronDown} />
          <div class='collapse' id='price'>
            <ul className='list-group'>
              <li className='list-group-item sb'>
                <div class='custom-control custom-radio'>
                  <input type='radio' class='custom-control-input' name='pr' id='less-5000' value='l-5000' onChange={() => this.setState({ filterPrice: 1 })}></input>
                  <label class='custom-control-label' for='less-5000'>Menos de $5,000</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class='custom-control custom-radio'>
                  <input type='radio' class='custom-control-input' name='pr' id='5000-to-10000' value='50000-10000' onChange={() => this.setState({ filterPrice: 2 })}></input>
                  <label class='custom-control-label' for='5000-to-10000'>$5,000 - $10,000</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class='custom-control custom-radio'>
                  <input type='radio' class='custom-control-input' name='pr' id='more-10000' value='m-10000' onChange={() => this.setState({ filterPrice: 3 })}></input>
                  <label class='custom-control-label' for='more-10000'>Mas de  $10,000</label>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li className='list-group-item sb'>
          <a className='sb-item' data-toggle='collapse' href='#stock' role='button' aria-expanded='false' aria-controls='stock'>
            Cantidad
          </a>
          <FontAwesomeIcon icon={faChevronDown} />
          <div className='collapse' id='stock'>
            <ul className='list-group'>
              <li className='list-group-item sb'>
                <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" name='stk' id="nostock" value='no' onChange={() => this.setState({ filterStock: 1 })}></input>
                  <label class="custom-control-label" for="nostock">Sin cantidad disponible</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" name='stk' id="withstock" value='yes' onChange={() => this.setState({ filterStock: 2 })}></input>
                  <label class="custom-control-label" for="withstock">Con cantidad disponible</label>
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
            <input type='radio' class='custom-control-input' name='sort' id='sortPrice' value='price' onChange={() => this.setState({ orderOption: 1 })}></input>
            <label class='custom-control-label' for='sortPrice'>Precio</label>
          </div>
        </li>
        <li className='list-group-item sb'>
          <div className='custom-control custom-radio'>
            <input type='radio' class='custom-control-input' name='sort' id='sortAvailability' value='available' onChange={() => this.setState({ orderOption: 2 })}></input>
            <label class='custom-control-label' for='sortAvailability'>Disponibilidad</label>
          </div>
        </li>
        <li className='list-group-item sb'>
          <div className='custom-control custom-radio'>
            <input type='radio' class='custom-control-input' name='sort' id='sortQuantity' value='quantity' onChange={() => this.setState({ orderOption: 3 })}></input>
            <label class='custom-control-label' for='sortQuantity'>Cantidad</label>
          </div>
        </li>
      </ul>
    )
  }

  renderProducts = (products) => {
    return this.productSort(this.productFilter(products))
      .map(p => {
        var opts = {}
        if (!p.available) {
          opts['disabled'] = 'disabled'
        }
        return (
          <div className='col-md-4'>
            <div class='card'>
              <div class='card-body'>
                <h5 class='card-title'>{p.name}</h5>
                <h6 class='card-subtitle mb-2 text-muted'>{p.price}</h6>
                <p class='card-text'>Cantidad: {p.quantity}</p>
                <p class='card-text'>{p.available ? 'Disponible' : 'No Disponible'}</p>
                <button type='button' className='btn btn-success d-flex float-right align-items-center' {...opts} onClick={() => this.storeProduct(p)}>
                  <div className='add'>Add to Cart</div>
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
    var data = Object.assign({}, shoppingCartItems)
    for (var i in data) {
      var item = JSON.parse(shoppingCartItems[i])
      shoppingCart.push(
        <ul className='list-group'>
          <li className='list-group-item'>
            <div className='d-inline proof'>
              <h6 className='d-inline mr-1'><b>Nombre:</b></h6>
              <p className='d-inline mr-3'>{item.name}</p>
              <h6 className='d-inline mr-1'>Precio:</h6>
              <p className='d-inline mr-3'>{item.price}</p>
              <h6 className='d-inline mr-1'>{item.quantity} Unidades disponibles</h6>
            </div>
            <button className='btn btn-danger float-right ml-2' onClick={() => this.deleteItem(i)}>Eliminar</button>
            <button className='btn btn-success float-right ml-2' onClick={() => this.deleteItem(i)}>Comprar</button>
          </li>
        </ul>
      )
    }
    return shoppingCart
  }

  render() {
    let { products } = this.state
    return (
      <>
        <header className="navbar navbar-expand-md navbar-dark flex-column flex-md-row justify-content-between" id='bd-navbar'>
          <div className="container-fluid">
            <span className="navbar-brand" id='logo'>JC</span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#shoppingCar" aria-controls="shoppingCar" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="shoppingCar">
              <ul className='nav navbar-nav ml-auto'>
                <li>
                  <button type='button' className='btn' data-toggle='modal' data-target='#modalShoppingCart' id="button" onClick={this.onClick}>
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
                    <a className='sb-item hd' href='#categories' role='button' onClick={() => this.filterByCategory()}>
                      Categorías
                    </a>
                    {this.renderCategories(categories)}
                  </li>
                  <li className='list-group-item sb'>
                    <a className='sb-item hd' href='#filters' role='button'>
                      Filtros
                    </a>
                    {this.renderFilters()}
                  </li>
                  <li className='list-group-item sb'>
                    <a className='sb-item hd' href='#sorts' role='button'>
                      Ordenar Por
                    </a>
                    {this.renderSorts()}
                  </li>
                </ul>
              </div>
            </div>
            <main role="main" className="col-12 col-md-8 ml-sm-auto col-lg-9 px-4">
              <div className='row mt-3'>
                {this.renderProducts(products)}
              </div>
            </main>
          </div>
        </div>

        <div class="modal fade" id="modalShoppingCart" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Carrito de Compras</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
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
