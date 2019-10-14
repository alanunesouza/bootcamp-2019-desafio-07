import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import reactotron from 'reactotron-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';
import { formatPrice } from '../../util/format';
import {
  Container,
  Product,
  ProductPrice,
  ProductImage,
  ProductTitle,
  ProductAmount,
  ProductAmountText,
  AddButton,
  AddButtonText,
} from './styles';

class Home extends Component {
  state = {
    products: [],
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    const response = await api.get('/products');
    reactotron.log('aqui', response);

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data });
  };

  handleAddProduct = id => {
    reactotron.log('add', this.props, id);
    const { addToCartRequest } = this.props;
    addToCartRequest(id);
  };

  renderProduct = ({ item }) => (
    <Product key={item.id}>
      <ProductImage source={{ uri: item.image }} />
      <ProductTitle>{item.title}</ProductTitle>
      <ProductPrice>{item.priceFormatted}</ProductPrice>

      <AddButton onPress={() => this.handleAddProduct(item.id)}>
        <ProductAmount>
          <Icon name="add-shopping-cart" color="#FFF" size={20} />
          <ProductAmountText>
            {this.props.amount[item.id] || 0}
          </ProductAmountText>
        </ProductAmount>
        <AddButtonText>ADICIONAR</AddButtonText>
      </AddButton>
    </Product>
  );

  render() {
    const { products } = this.state;

    return (
      <Container>
        <FlatList
          horizontal
          data={products}
          extraData={this.props}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderProduct}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
