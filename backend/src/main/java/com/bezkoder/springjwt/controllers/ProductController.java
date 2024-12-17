package com.bezkoder.springjwt.controllers;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bezkoder.springjwt.models.Image;
import com.bezkoder.springjwt.models.Product;
import com.bezkoder.springjwt.models.Rating;
import com.bezkoder.springjwt.models.RatingStatus;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.NewProductRequest;
import com.bezkoder.springjwt.repository.ImageRepository;
import com.bezkoder.springjwt.repository.ProductRepository;
import com.bezkoder.springjwt.repository.UserRepository;



@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired 
    private UserRepository userRepository;

    @GetMapping("/productdata")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/productdata/{id}")
    public Optional<Product> getProduct(@PathVariable Long id){
        return productRepository.findById(id);
    }

    @PostMapping("/productdata")
    public Product createProduct(@RequestBody NewProductRequest productRequest) {
        System.out.println(productRequest);
        return productRepository.save(GetProduct(productRequest));
    }

    @PostMapping("/productdata/batch")
    public List<Product> createProducts(@RequestBody List<NewProductRequest> productRequests) {
        List<Product> products = new ArrayList<>();
        productRequests.forEach(productRequest -> {
            products.add(GetProduct(productRequest));
        });
        return productRepository.saveAll(products);
    }

    @PutMapping("/productdata/{id}")
    public ResponseEntity<Product> editProduct(@PathVariable Long id, @RequestBody NewProductRequest productRequest){
        Product newProduct = GetProduct(productRequest);
        newProduct.setId(id);
        return ResponseEntity.ok(productRepository.save(newProduct));
    }

    private Product GetProduct(NewProductRequest productRequest) {
        Product newProduct = new Product(
                productRequest.getTitle(),
                productRequest.getBrand(),
                productRequest.getCategory(),
                productRequest.getDescription(),
                productRequest.getPrice());
        String[] images = productRequest.getImages();
        Set<Image> imagelinks = new HashSet<>();
        for (String image : images) {
            Image targetImage;
            if (!imageRepository.existsByImagelink(image)) {
                targetImage = imageRepository.save(new Image(image));
            } else {
                targetImage = imageRepository.findByImagelink(image).get();
            }
            imagelinks.add(targetImage);
        }
        Set<Rating> ratings = new HashSet<>();
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Auth Name: " + authentication.getName());
        User user = userRepository.findByUsername(authentication.getName()).get();
        for(int i=0;i<productRequest.getRaters();i++){
            Rating newRating = new Rating(productRequest.getRating(), null, null);
            newRating.setUser(user);
            ratings.add(newRating);
        }
        RatingStatus ratingStatus = new RatingStatus();
        ratingStatus.setRatings(ratings);
        newProduct.setRatingStatus(ratingStatus);
        newProduct.setImages(imagelinks);
        return newProduct;
    }

}
