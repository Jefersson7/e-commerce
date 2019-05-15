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
      products: products.sort((a, b) => this.convertOnNumber(a.price) - this.convertOnNumber(b.price))
    }
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
                    <a className='sb-item' data-toggle='collapse' href={`#c${i.id}`} id={i.id} role='button' aria-expanded="false" aria-controls={`c${i.id}`} onClick={this.filterProducts}>
                      {i.name}
                    </a>
                    <FontAwesomeIcon icon={faChevronDown} />
                    <div className='collapse' id={`c${i.id}`} >
                      {this.renderCategories(i.sublevels)}
                    </div>
                  </>
                ) : (
                    <>
                      <a href={`#c${i.id}`} id={i.id} role='button' onClick={this.filterProducts}>
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
                  <input type="radio" class="custom-control-input" name='available' id="available" value='false'></input>
                  <label class="custom-control-label" for="available">Disponible</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" name='available' id="noavailable" value='true'></input>
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
                  <input type='radio' class='custom-control-input' name='available' id='less-5000' value='l-5000'></input>
                  <label class='custom-control-label' for='less-5000'>Menos de $5,000</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class='custom-control custom-radio'>
                  <input type='radio' class='custom-control-input' name='available' id='5000-to-10000' value='50000-10000'></input>
                  <label class='custom-control-label' for='5000-to-10000'>$5,000 - $10,000</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class='custom-control custom-radio'>
                  <input type='radio' class='custom-control-input' name='available' id='more-10000' value='m-10000'></input>
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
                  <input type="radio" class="custom-control-input" name='stock' id="nostock" value='no'></input>
                  <label class="custom-control-label" for="nostock">Sin cantidad disponible</label>
                </div>
              </li>
              <li className='list-group-item sb'>
                <div class="custom-control custom-radio">
                  <input type="radio" class="custom-control-input" name='stock' id="withstock" value='yes'></input>
                  <label class="custom-control-label" for="withstock">Con cantidad disponible</label>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    )
  }

  filterProducts = (e) => {
    console.log(products.filter(i => i.sublevel_id === this.convertOnNumber(e.target.id)))
  }

  convertOnNumber = (e) => {
    return parseInt(e.replace(/[^0-9]/g, ''))
  }

  onClick = () => {
    console.log(products.filter(i => i.sublevel_id === 5)
      .sort((a, b) => this.convertOnNumber(a.price) - this.convertOnNumber(b.price)))
  }

  render() {
    let { products } = this.state
    return (
      <>
        <header className="navbar navbar-expand-md navbar-dark flex-column flex-md-row justify-content-between" id='bd-navbar'>
          <div className="container-fluid">
            <span className="navbar-brand" id='logo'>El baraton</span>
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
                    <a className='sb-item hd' data-toggle='collapse' href='#categories' role='button' aria-expanded='false' aria-controls='categories'>
                      Categorías
                    </a>
                    <FontAwesomeIcon icon={faChevronDown} />
                    <div className='collapse' id='categories'>
                      {this.renderCategories(categories)}
                    </div>
                  </li>
                  <li className='list-group-item sb'>
                    <a className='sb-item hd' data-toggle='collapse' href='#filters' role='button' aria-expanded='false' aria-controls='filters'>
                      Filtros
                    </a>
                    <FontAwesomeIcon icon={faChevronDown} />
                    <div className='collapse' id='filters'>
                      {this.renderFilters()}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <main role="main" className="col-12 col-md-8 ml-sm-auto col-lg-9 px-4">
              <div className='row mt-3'>
                {products.map(p => {
                  return (
                    <div className='col-md-4'>
                      <div class='card'>
                        <div class='card-body'>
                          <h5 class='card-title'>{p.name}</h5>
                          <h6 class='card-subtitle mb-2 text-muted'>{p.price}</h6>
                          <p class='card-text'>Cantidad: {p.quantity}</p>
                          <p class='card-text'>{p.available ? 'Disponible' : 'No Disponible'}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </main>
          </div>
        </div>

        <div class="modal fade" id="modalShoppingCart" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class='row'>
                {products.map(p => {
                    return (
                      <div className='col-md-4'>
                        <div class='card'>
                          <div class='card-body'>
                            <h5 class='card-title'>{p.name}</h5>
                            <h6 class='card-subtitle mb-2 text-muted'>{p.price}</h6>
                            <p class='card-text'>Cantidad: {p.quantity}</p>
                            <p class='card-text'>{p.available ? 'Disponible' : 'No Disponible'}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default App;
