package com.product.ServiceImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.product.Repository.ProductRepository;
import com.product.model.product;
import com.product.service.ProductService;

@Service
public class productServiceImpl implements ProductService {

	@Autowired
	private ProductRepository productRepository;
	
	
	// JPA Query
	@Override
	public product insertProduct(product singleProduct) {
	
		return productRepository.save(singleProduct);
	}

	// JPA Query
	@Override
	public List<product> insertAll(List<product> manyProduct) {
		
		return productRepository.saveAll(manyProduct);
	}

	// JPA Query
	@Override
	public List<product> getAllProduct() {
		
		return productRepository.findAll();
	}

	// JPA Query
	@Override
	public product updateById(product updateProduct) {
		
		return productRepository.save(updateProduct);
	}

	// JPA Query
	@Override
	public String deleteById(Long id) {
		 productRepository.deleteById(id);
		 return "deleted id " + id;
		
	}

	@Override
	public List<product> getProductByName(String productName) {
		
		return productRepository.findByProductName(productName);
	}

	@Override
	public List<product> getById(Long id) {
		
		return productRepository.findByIdId(id);
	}

	@Override
	public List<product> getByNamePrice(String productName, String productPrice) {
		
		return productRepository.getByNamePrice(productName,productPrice);
	}

	@Override
	public List<product> findByProductNameParam(String productName) {
		
		return productRepository.findByProductNameParam(productName);
	}

	@Override
	public List<product> findByPriceParam(String productPrice) {
	
		return productRepository.getByPriceParam(productPrice);
	}

	@Override
	public List<product> findByPriceBetweenParam(String productPrice) {
		
		return productRepository.getProductPriceBetweenParam(productPrice);
	}

	@Override
	public List<product> findByProductNameParamINParamIN(String productName) {
		
		return productRepository.getByProductNameIN(productName);
	}
	
	@Override
	public List<product> findByProductNameParamNotIN(String productName) {
		
		return productRepository.getByProductNameNotIN(productName);
	}


	@Override
	public List<product> findfindByLike(String productName) {
		
		return productRepository.getByLike(productName);
	}

	@Override
	public List<product> findByMaxProductPrice(String productPrice) {
		
		return productRepository.getByMax(productPrice);
	}

	@Override
	public product UpdateBySqlNative(String productName) {
		
		return productRepository.updateBySQLNative(productName);
	}

	@Override
	public Optional<product> findById(Long id) {
		
		return productRepository.findById(id);
	}

	@Override
	public List<product> findByproductNameOrproductPrice(String productName, String productPrice) {
		
		return productRepository.findByProductNameAndProductPrice(productName,productPrice);
	}

	@Override
	public List<product> findByIdOrProductName(Long pid, String productName) {
		
		return productRepository.findByPidOrProductName(pid,productName);
	}

	@Override
	public product updateByIdOrProductName(Long pid, String productName) {
	
		return productRepository.saveAll(pid,productName);
	}

	
	

	

	
	
	

	

	
	
	
	
	

	
	

	
	
	

}
