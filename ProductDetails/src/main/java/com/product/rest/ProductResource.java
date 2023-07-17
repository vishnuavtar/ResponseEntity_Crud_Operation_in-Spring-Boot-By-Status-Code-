package com.product.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.support.RequestPartServletServerHttpRequest;

import com.product.Repository.ProductRepository;
import com.product.model.product;
import com.product.service.ProductService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class ProductResource {

	@Autowired
	private ProductService productService;

	// inserting single record at a time

	@PostMapping("products/saveSingleRecord")
	public ResponseEntity<product> insert(@RequestBody product singleProduct) {

		try {
			return new ResponseEntity<product>(productService.insertProduct(singleProduct), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();

			return new ResponseEntity<product>(HttpStatus.BAD_REQUEST);
		}

	}

	// insert than one record at a time

	@PostMapping("/products/saveAllProduct")
	public ResponseEntity<List<product>> insertAll(@RequestBody List<product> manyProduct) {

		try {
			return new ResponseEntity<List<product>>(productService.insertAll(manyProduct), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<product>>(HttpStatus.BAD_REQUEST);
		}
	}

	// get All Record

	@GetMapping("/products")
	public ResponseEntity<List<product>> getAllProduct() {

		List<product> getAllProduct = productService.getAllProduct();

		if (getAllProduct != null) {
			return new ResponseEntity<List<product>>(getAllProduct, HttpStatus.OK);
		} else {
			return new ResponseEntity<List<product>>(HttpStatus.BAD_REQUEST);
		}
	}

	// update record

	@PutMapping("/products/{pid}")
	public ResponseEntity<product> updateById(@RequestBody product updateProduct, @PathVariable("pid") Long pid) {

		try {
			return new ResponseEntity<product>(productService.updateById(updateProduct), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<product>(HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping("/products/delete/{id}")
	public String deleteById(@PathVariable("id") Long id) {
		return productService.deleteById(id);
	}

	@GetMapping("products/getid/{id}")
	public ResponseEntity<List<product>> findById(@PathVariable("id") Long id) {

		List<product> findById = productService.getById(id);

		if (findById != null) {
			return new ResponseEntity<List<product>>(findById, HttpStatus.OK);
		} else {
			return new ResponseEntity<List<product>>(HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/products/get/{productName}")
	public ResponseEntity<List<product>> findByproductName(@PathVariable("productName") String productName) {
		List<product> findByproductName = productService.getProductByName(productName);

		if (findByproductName != null) {
			return new ResponseEntity<List<product>>(findByproductName, HttpStatus.OK);
		} else {
			return new ResponseEntity<List<product>>(HttpStatus.BAD_REQUEST);
		}

	}

	@GetMapping("/products/get/{productName}/{productPrice}")
	public List<product> findByNameAndprice(@PathVariable("productName") String productName,
			@PathVariable("productPrice") String productPrice) {

		return productService.getByNamePrice(productName, productPrice);
	}

	@GetMapping("/products/get")
	public List<product> findByParam(@RequestParam("productName") String productName) {

		return productService.findByProductNameParam(productName);
	}

	@GetMapping("/products/price")
	public List<product> findByPriceParam(@RequestParam("productPrice") String productPrice) {

		return productService.findByPriceParam(productPrice);
	}

	@GetMapping("/products/priceBetween")
	public List<product> findByPriceBetweenParam(@RequestParam("productPrice") String productPrice) {
		return productService.findByPriceBetweenParam(productPrice);
	}

	@GetMapping("/products/IN")
	public List<product> findByProductNameParamIN(@RequestParam("productName") String productName) {
		return productService.findByProductNameParamINParamIN(productName);
	}

	@GetMapping("/products/NotIN")
	public List<product> findByProductNameParamNotIN(@RequestParam("productName") String productName) {
		return productService.findByProductNameParamNotIN(productName);
	}

	@GetMapping("/products/like")
	public List<product> findByLike(@RequestParam("productName") String productName) {

		return productService.findfindByLike(productName);
	}

	@GetMapping("products/max")
	public List<product> findByMaxProductPrice(@RequestParam("productPrice") String productPrice) {
		return productService.findByMaxProductPrice(productPrice);
	}

	// Update by sql native

	@PutMapping("products/updatesqlnative")
	public product UpdateBySqlNative(@RequestParam("productName") String productName) {

		return productService.UpdateBySqlNative(productName);

	}

	// JPA Query not JPQL
	// findByid

	@GetMapping("/products/getById/{id}")
	public Optional<product> findByIdJPA(@PathVariable Long id) {
		return productService.findById(id);
	}

	@GetMapping("/products/productNamePrice")
	public ResponseEntity<List<product>> findByproductNameOrproductPrice(
			@RequestParam("productName") String productName, @RequestParam("productPrice") String productPrice) {

		try {
			return new ResponseEntity<List<product>>(productService.findByproductNameOrproductPrice(productName,productPrice), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<List<product>>(HttpStatus.BAD_REQUEST);
		}

	}
	
	
	@GetMapping("/products/productIdName")
	public ResponseEntity<List<product>> findByIdOrProductName(@RequestParam("pid") Long pid,@RequestParam("productName")  String productName){
		
		try {
			return new ResponseEntity<List<product>>(productService.findByIdOrProductName(pid,productName), HttpStatus.OK);
		}catch(Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<product>>(HttpStatus.BAD_REQUEST);
		}
	}
	
	@PutMapping("/products/updateByIdOrProductName")
	public ResponseEntity<product> updateByIdOrProductName(@RequestParam("pid") Long pid , @RequestParam("productName") String productName){
		
		try {
			return new ResponseEntity<product>(productService.updateByIdOrProductName(pid,productName), HttpStatus.OK);
		}catch(Exception e) {
			return new ResponseEntity<product>(HttpStatus.BAD_REQUEST);
		}
	}

}
