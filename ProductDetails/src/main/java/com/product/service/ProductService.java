package com.product.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;

import com.product.model.product;

public interface ProductService {

	

	List<product> findByproductNameOrproductPrice(String productName , String productPrice);

	product insertProduct(product singleProduct);

	List<product> insertAll(List<product> manyProduct);

	List<product> getAllProduct();

	product updateById(product updateProduct);

	String deleteById(Long id);

	List<product> getProductByName(String productName);

	List<product> getById(Long id);

	List<product> getByNamePrice(String productName, String productPrice);

	
	 List<product> findByProductNameParam(String productName);

	List<product> findByPriceParam(String productPrice);

	List<product> findByPriceBetweenParam(String productPrice);

	List<product> findByProductNameParamINParamIN(String productName);
	
	List<product> findByProductNameParamNotIN(String productName);

	List<product> findfindByLike(String productName);

	List<product> findByMaxProductPrice(String productPrice);

	product UpdateBySqlNative(String productName);

	Optional<product> findById(Long id);

	List<product> findByIdOrProductName(Long pid, String productName);

	product updateByIdOrProductName(Long pid, String productName);



	
	

	

	

	
	

	



	

	

	



	
	

	

	


}
