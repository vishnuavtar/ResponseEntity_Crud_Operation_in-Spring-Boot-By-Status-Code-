package com.product.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.product.model.product;

public interface ProductRepository extends JpaRepository<product, Long>{

	List<product> findByProductName(String productName);

	@Query("select u from product u where u.id=:n")
	List<product> findByIdId(@Param("n") Long id);

	@Query("select u from product u  where u.productName=:n AND u.productPrice=:m")
	List<product> getByNamePrice(@Param("n") String productName,@Param("m") String productPrice);

	@Query(value = "select * from product where product_name='Bike' or product_name='scooty'" , nativeQuery = true)
	List<product> findByProductNameParam(String productName);

	@Query(value = "select * from product where product_price>='40000'" , nativeQuery = true)
	List<product> getByPriceParam(String productPrice);

	@Query(value = "select * from product where product_price between 20000 AND 40000" , nativeQuery = true)
	List<product> getProductPriceBetweenParam(String productPrice);

	@Query(value = "select * from product where product_name IN ('Bike' , 'scooty')" , nativeQuery = true)
	List<product> getByProductNameIN(String productName);
	
	@Query(value = "select * from product where product_name NOT IN ('Bike' , 'scooty')" , nativeQuery = true)
	List<product> getByProductNameNotIN(String productName);
	

	@Query(value = "select * from product where product_name like 'Bi%'" , nativeQuery = true)
	List<product> getByLike(String productName);

	@Query(value = "select max(product_price) from product" , nativeQuery = true)
	List<product> getByMax(String productPrice);

	
	@Query(value = "update product set product_name='BMW' where pid=6" , nativeQuery = true)
	product updateBySQLNative(String productName);

	List<product> findByProductNameAndProductPrice(String productName, String productPrice);

	List<product> findByPidOrProductName(Long pid, String productName);

	product saveAll(Long pid, String productName);

	

	
	

	
	
	

	

	

	

}
