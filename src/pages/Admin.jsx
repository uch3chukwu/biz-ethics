import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { categories } from "../data/categories";

const emptyProduct = {
  id: null,
  manufacturer_id: "",
  manufacturer: "",
  name: "",
  model: "",
  category: "networking",
  description: "",
  specs: "",
  image_url: "",
  image_path: "",
  price: "",
  show_price: false,
  available: true,
  is_custom: false,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      setSession(currentSession);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return <AdminDashboard session={session} />;
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setError(loginError.message);
    }

    setLoading(false);
  };

  return (
    <main className="admin-page">
      <div className="admin-container admin-login">
        <span className="admin-eyebrow">
          BIZ-ETHICS / ADMIN
        </span>

        <h1>
          Catalogue
          <br />
          <em>management.</em>
        </h1>

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@email.com"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
            />
          </label>

          {error && (
            <p className="admin-error">
              {error}
            </p>
          )}

          <button
            className="admin-primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

function AdminDashboard({ session }) {
  const [products, setProducts] = useState([]);
  const [manufacturers, setManufacturers] =
    useState([]);

  const [productForm, setProductForm] =
    useState(emptyProduct);

  const [manufacturerName, setManufacturerName] =
    useState("");

  const [editingManufacturerId, setEditingManufacturerId] =
    useState(null);

  const [editingManufacturerName, setEditingManufacturerName] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [editingProduct, setEditingProduct] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] =
    useState(false);
  const [activeProductAction, setActiveProductAction] =
    useState(null);
  const [manufacturerSaving, setManufacturerSaving] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [manufacturerFilter, setManufacturerFilter] =
    useState("all");

  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    return sortedProducts.filter(
      (product) => {
        const matchesSearch =
          normalizedSearch === "" ||
          product.name
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          product.model
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          product.manufacturer
            ?.toLowerCase()
            .includes(normalizedSearch);

        const matchesCategory =
          categoryFilter === "all" ||
          product.category === categoryFilter;

        const matchesManufacturer =
          manufacturerFilter === "all" ||
          product.manufacturer_id ===
            manufacturerFilter;

        const matchesAvailability =
          availabilityFilter === "all" ||
          (availabilityFilter ===
            "available" &&
            product.available) ||
          (availabilityFilter ===
            "hidden" &&
            !product.available);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesManufacturer &&
          matchesAvailability
        );
      }
    );
  }, [
    sortedProducts,
    searchTerm,
    categoryFilter,
    manufacturerFilter,
    availabilityFilter,
  ]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        manufacturersResult,
        productsResult,
      ] = await Promise.all([
        supabase
          .from("manufacturers")
          .select("*")
          .order("name"),

        supabase
          .from("products")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),
      ]);

      if (manufacturersResult.error) {
        setError(manufacturersResult.error.message);
        return false;
      }

      if (productsResult.error) {
        setError(productsResult.error.message);
        return false;
      }

      setManufacturers(manufacturersResult.data || []);
      setProducts(productsResult.data || []);
      return true;
    } catch (loadError) {
      setError(
        loadError.message ||
          "Unable to load catalogue data. Please try again."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetImageState = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const getCategoryName = (categoryId) => {
    return (
      categories.find((category) => category.id === categoryId)
        ?.name || categoryId
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setManufacturerFilter("all");
    setAvailabilityFilter("all");
  };

  const updateProductField = (
    field,
    value
  ) => {
    setProductForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleManufacturerChange = (
    value
  ) => {
    const manufacturer =
      manufacturers.find(
        (item) => item.id === value
      );

    setProductForm((current) => ({
      ...current,
      manufacturer_id: value,
      manufacturer:
        manufacturer?.name || "",
    }));
  };

  const handleImageChange = (event) => {
    resetMessages();

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setError(
        "Please choose a JPG, PNG or WebP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError(
        "Image must be 5 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);
  };

  const uploadProductImage = async (
    file,
    productName
  ) => {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const safeName = productName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const uniqueId =
      crypto.randomUUID();

    const filePath =
      `products/${uniqueId}-${safeName}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

    if (uploadError) {
      throw new Error(
        `Image upload failed: ${uploadError.message}`
      );
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      await supabase.storage
        .from("product-images")
        .remove([filePath]);

      throw new Error(
        "The image uploaded, but its public URL could not be created."
      );
    }

    return {
      image_url:
        publicUrlData.publicUrl,
      image_path: filePath,
    };
  };

  const removeProductImage = async (
    imagePath
  ) => {
    if (!imagePath) {
      return null;
    }

    const { error: removeError } =
      await supabase.storage
        .from("product-images")
        .remove([imagePath]);

    return removeError || null;
  };

  const handleProductSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    resetMessages();
    setSaving(true);

    let uploadedImagePath = null;

    try {
      const specs = productForm.specs
        .split("\n")
        .map((spec) => spec.trim())
        .filter(Boolean);

      const rawPrice =
        String(productForm.price).trim();

      const parsedPrice =
        rawPrice === ""
          ? null
          : Number(rawPrice);

      if (
        parsedPrice !== null &&
        (!Number.isFinite(parsedPrice) ||
          parsedPrice < 0)
      ) {
        setError(
          "Please enter a valid price."
        );
        setSaving(false);
        return;
      }

      const payload = {
        manufacturer_id:
          productForm.manufacturer_id ||
          null,

        manufacturer:
          productForm.manufacturer.trim(),

        name:
          productForm.name.trim(),

        model:
          productForm.model.trim() ||
          null,

        category:
          productForm.category,

        description:
          productForm.description.trim() ||
          null,

        specs,

        image_url:
          productForm.image_url || null,

        image_path:
          productForm.image_path || null,

        price: parsedPrice,

        show_price:
          parsedPrice !== null
            ? productForm.show_price
            : false,

        available:
          productForm.available,

        is_custom:
          productForm.is_custom,
      };

      if (!payload.manufacturer) {
        setError(
          "Please select a manufacturer."
        );
        setSaving(false);
        return;
      }

      if (!payload.name) {
        setError(
          "Please enter a product name."
        );
        setSaving(false);
        return;
      }

      if (selectedImage) {
        setImageUploading(true);

        let uploadedImage;

        try {
          uploadedImage = await uploadProductImage(
            selectedImage,
            payload.name
          );
        } finally {
          setImageUploading(false);
        }

        payload.image_url =
          uploadedImage.image_url;

        payload.image_path =
          uploadedImage.image_path;

        uploadedImagePath =
          uploadedImage.image_path;
      }

      let result;

      if (editingProduct) {
        result = await supabase
          .from("products")
          .update(payload)
          .eq("id", productForm.id);
      } else {
        result = await supabase
          .from("products")
          .insert(payload);
      }

      if (result.error) {
        if (uploadedImagePath) {
          await removeProductImage(
            uploadedImagePath
          );
        }

        setError(result.error.message);
        setSaving(false);
        return;
      }

      if (
        editingProduct &&
        selectedImage &&
        productForm.image_path &&
        productForm.image_path !==
          uploadedImagePath
      ) {
        const cleanupError = await removeProductImage(
          productForm.image_path
        );

        if (cleanupError) {
          setError(
            `Product updated, but the previous image could not be removed: ${cleanupError.message}`
          );
        }
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully."
          : "Product added successfully."
      );

      setProductForm(emptyProduct);
      setEditingProduct(false);
      resetImageState();

      const fileInput =
        document.getElementById(
          "product-image"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await loadData();
    } catch (submitError) {
      if (uploadedImagePath) {
        await removeProductImage(
          uploadedImagePath
        );
      }

      setError(
        submitError.message ||
          "Something went wrong while saving the product."
      );
    } finally {
      setImageUploading(false);
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    resetMessages();

    setProductForm({
      id: product.id,

      manufacturer_id:
        product.manufacturer_id || "",

      manufacturer:
        product.manufacturer || "",

      name:
        product.name || "",

      model:
        product.model || "",

      category:
        product.category || "networking",

      description:
        product.description || "",

      specs:
        Array.isArray(product.specs)
          ? product.specs.join("\n")
          : "",

      image_url:
        product.image_url || "",

      image_path:
        product.image_path || "",

      price:
        product.price !== null &&
        product.price !== undefined
          ? String(product.price)
          : "",

      show_price:
        product.show_price ?? false,

      available:
        product.available ?? true,

      is_custom:
        product.is_custom ?? false,
    });

    setSelectedImage(null);
    setImagePreview(
      product.image_url || ""
    );

    setEditingProduct(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setProductForm(emptyProduct);
    setEditingProduct(false);
    resetImageState();
    resetMessages();

    const fileInput =
      document.getElementById(
        "product-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const deleteProduct = async (
    product
  ) => {
    if (activeProductAction) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${product.name}"? This will also remove its image and cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    resetMessages();

    setActiveProductAction(`delete-${product.id}`);

    try {
      const { error: deleteError } =
        await supabase
          .from("products")
          .delete()
          .eq("id", product.id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      const cleanupError = await removeProductImage(
        product.image_path
      );

      if (productForm.id === product.id) {
        cancelEdit();
      }

      setSuccess(
        cleanupError
          ? "Product deleted, but its image could not be removed from storage."
          : "Product deleted successfully."
      );

      await loadData();
    } catch (deleteFailure) {
      setError(
        deleteFailure.message ||
          "Unable to delete this product. Please try again."
      );
    } finally {
      setActiveProductAction(null);
    }
  };

  const toggleAvailability = async (
    product
  ) => {
    if (activeProductAction) {
      return;
    }

    resetMessages();
    setActiveProductAction(`availability-${product.id}`);

    try {
      const { error: updateError } =
        await supabase
          .from("products")
          .update({
            available: !product.available,
          })
          .eq("id", product.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(
        product.available
          ? "Product hidden from the catalogue."
          : "Product is now visible in the catalogue."
      );

      await loadData();
    } catch (updateFailure) {
      setError(
        updateFailure.message ||
          "Unable to update product availability."
      );
    } finally {
      setActiveProductAction(null);
    }
  };

  const addManufacturer = async (
    event
  ) => {
    event.preventDefault();

    if (manufacturerSaving) {
      return;
    }

    resetMessages();

    const name =
      manufacturerName.trim();

    if (!name) {
      setError(
        "Enter a manufacturer name."
      );
      return;
    }

    const normalizedName =
      name.toLowerCase();

    const existingManufacturer =
      manufacturers.find(
        (manufacturer) =>
          manufacturer.name
            .toLowerCase() ===
          normalizedName
      );

    if (existingManufacturer) {
      setError(
        `${existingManufacturer.name} already exists.`
      );
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setManufacturerSaving(true);

    try {
      const { error: insertError } =
        await supabase
          .from("manufacturers")
          .insert({
            name,
            slug,
          });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setManufacturerName("");
      setSuccess("Manufacturer added successfully.");
      await loadData();
    } catch (manufacturerError) {
      setError(
        manufacturerError.message ||
          "Unable to add this manufacturer."
      );
    } finally {
      setManufacturerSaving(false);
    }
  };

  const startManufacturerEdit = (
    manufacturer
  ) => {
    resetMessages();

    setEditingManufacturerId(
      manufacturer.id
    );

    setEditingManufacturerName(
      manufacturer.name
    );
  };

  const cancelManufacturerEdit = () => {
    setEditingManufacturerId(null);
    setEditingManufacturerName("");
    resetMessages();
  };

  const saveManufacturerEdit = async () => {
    resetMessages();

    const name =
      editingManufacturerName.trim();

    if (!name) {
      setError(
        "Manufacturer name cannot be empty."
      );
      return;
    }

    const currentManufacturer =
      manufacturers.find(
        (manufacturer) =>
          manufacturer.id ===
          editingManufacturerId
      );

    if (!currentManufacturer) {
      setError(
        "Manufacturer could not be found."
      );
      return;
    }

    const duplicate =
      manufacturers.find(
        (manufacturer) =>
          manufacturer.id !==
            editingManufacturerId &&
          manufacturer.name
            .toLowerCase() ===
            name.toLowerCase()
      );

    if (duplicate) {
      setError(
        `${duplicate.name} already exists.`
      );
      return;
    }

    const newSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const { error: updateManufacturerError } =
      await supabase
        .from("manufacturers")
        .update({
          name,
          slug: newSlug,
        })
        .eq(
          "id",
          editingManufacturerId
        );

    if (updateManufacturerError) {
      setError(
        updateManufacturerError.message
      );
      return;
    }

    /*
      Keep the denormalized manufacturer field
      on all related products in sync.
    */

    const { error: productUpdateError } =
      await supabase
        .from("products")
        .update({
          manufacturer: name,
        })
        .eq(
          "manufacturer_id",
          editingManufacturerId
        );

    if (productUpdateError) {
      setError(
        `Manufacturer renamed, but related products could not be updated: ${productUpdateError.message}`
      );

      await loadData();
      return;
    }

    setEditingManufacturerId(null);
    setEditingManufacturerName("");

    setSuccess(
      "Manufacturer updated successfully."
    );

    await loadData();
  };

  const deleteManufacturer = async (
    manufacturer
  ) => {
    resetMessages();

    const relatedProducts =
      products.filter(
        (product) =>
          product.manufacturer_id ===
          manufacturer.id
      );

    if (relatedProducts.length > 0) {
      setError(
        `${manufacturer.name} cannot be deleted because ${relatedProducts.length} product${
          relatedProducts.length === 1
            ? ""
            : "s"
        } use this manufacturer. Edit or remove those products first.`
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete "${manufacturer.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const { error: deleteError } =
      await supabase
        .from("manufacturers")
        .delete()
        .eq("id", manufacturer.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (
      editingManufacturerId ===
      manufacturer.id
    ) {
      cancelManufacturerEdit();
    }

    setSuccess(
      "Manufacturer deleted successfully."
    );

    await loadData();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    categoryFilter !== "all" ||
    manufacturerFilter !== "all" ||
    availabilityFilter !== "all";

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">
              BIZ-ETHICS / ADMIN
            </span>

            <h1>
              Catalogue
              <br />
              <em>management.</em>
            </h1>
          </div>

          <div className="admin-header-actions">
            <span>
              {session.user.email}
            </span>

            <button
              type="button"
              className="admin-secondary-button"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        </header>

        {error && (
          <div
            className="admin-message admin-message-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="admin-message admin-message-success"
            role="status"
          >
            {success}
          </div>
        )}

        <div className="admin-layout">
          {/* =================================================
              PRODUCT FORM
          ================================================= */}

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-label">
                  {editingProduct
                    ? "EDIT PRODUCT"
                    : "NEW PRODUCT"}
                </span>

                <h2>
                  {editingProduct
                    ? "Update product"
                    : "Add a product"}
                </h2>
              </div>

              {editingProduct && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={cancelEdit}
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form
              className="admin-product-form"
              onSubmit={handleProductSubmit}
            >
              {/* IMAGE */}

              <div className="admin-image-field">
                <span>
                  PRODUCT IMAGE
                </span>

                <label
                  htmlFor="product-image"
                  className="admin-image-upload"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                    />
                  ) : (
                    <span>
                      Choose product image
                    </span>
                  )}
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageChange
                  }
                  disabled={saving}
                />

                <span className="admin-help">
                  {imageUploading
                    ? "Uploading image..."
                    : imagePreview
                      ? "Choose a new file to replace this image. JPG, PNG or WebP, maximum 5 MB."
                      : "JPG, PNG or WebP. Maximum 5 MB."}
                </span>
              </div>

              {/* MANUFACTURER */}

              <label>
                Manufacturer

                <select
                  value={
                    productForm.manufacturer_id
                  }
                  onChange={(event) =>
                    handleManufacturerChange(
                      event.target.value
                    )
                  }
                  required
                  disabled={saving}
                >
                  <option value="">
                    Select manufacturer
                  </option>

                  {manufacturers.map(
                    (manufacturer) => (
                      <option
                        value={manufacturer.id}
                        key={manufacturer.id}
                      >
                        {manufacturer.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              {/* PRODUCT NAME */}

              <label>
                Product name

                <input
                  type="text"
                  value={
                    productForm.name
                  }
                  onChange={(event) =>
                    updateProductField(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. hEX S"
                  required
                  disabled={saving}
                />
              </label>

              {/* MODEL */}

              <label>
                Model

                <input
                  type="text"
                  value={
                    productForm.model
                  }
                  onChange={(event) =>
                    updateProductField(
                      "model",
                      event.target.value
                    )
                  }
                  placeholder="e.g. RB760iGS"
                  disabled={saving}
                />
              </label>

              {/* CATEGORY */}

              <label>
                Category

                <select
                  value={
                    productForm.category
                  }
                  onChange={(event) =>
                    updateProductField(
                      "category",
                      event.target.value
                    )
                  }
                  disabled={saving}
                >
                  {categories.map(
                    (category) => (
                      <option
                        value={category.id}
                        key={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              {/* PRICE */}

              <div className="admin-price-field">
                <label>
                  Price

                  <div className="admin-price-input">
                    <span>₦</span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        productForm.price
                      }
                      onChange={(event) =>
                        updateProductField(
                          "price",
                          event.target.value
                        )
                      }
                      placeholder="Leave blank for quote"
                      disabled={saving}
                    />
                  </div>
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      productForm.show_price
                    }
                    disabled={
                      saving ||
                      String(productForm.price).trim() === ""
                    }
                    onChange={(event) =>
                      updateProductField(
                        "show_price",
                        event.target.checked
                      )
                    }
                  />

                  Display price publicly
                </label>

                <span className="admin-help">
                  Leave the price blank when
                  customers should request a quote.
                </span>
              </div>

              {/* DESCRIPTION */}

              <label>
                Description

                <textarea
                  value={
                    productForm.description
                  }
                  onChange={(event) =>
                    updateProductField(
                      "description",
                      event.target.value
                    )
                  }
                  rows="5"
                  placeholder="Short description of the product."
                  disabled={saving}
                />
              </label>

              {/* SPECS */}

              <label>
                Specifications

                <textarea
                  value={
                    productForm.specs
                  }
                  onChange={(event) =>
                    updateProductField(
                      "specs",
                      event.target.value
                    )
                  }
                  rows="6"
                  placeholder={`One specification per line.
Example:
5 × Gigabit Ethernet
1 × SFP
RouterOS
Dual-core processor`}
                  disabled={saving}
                />

                <span className="admin-help">
                  Enter one specification per line.
                </span>
              </label>

              {/* OPTIONS */}

              <div className="admin-checkboxes">
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      productForm.available
                    }
                    onChange={(event) =>
                      updateProductField(
                        "available",
                        event.target.checked
                      )
                    }
                    disabled={saving}
                  />

                  Available
                </label>

                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={
                      productForm.is_custom
                    }
                    onChange={(event) =>
                      updateProductField(
                        "is_custom",
                        event.target.checked
                      )
                    }
                    disabled={saving}
                  />

                  Biz-Ethics product
                </label>
              </div>

              {/* ACTIONS */}

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? imageUploading
                      ? "Uploading image..."
                      : "Saving..."
                    : editingProduct
                      ? "Update product"
                      : "Save product"}
                </button>

                {editingProduct && (
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* =================================================
              MANUFACTURERS
          ================================================= */}

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="admin-label">
                  MANUFACTURERS
                </span>

                <h2>
                  Manage brands
                </h2>
              </div>
            </div>

            <form
              className="manufacturer-form"
              onSubmit={addManufacturer}
            >
              <input
                type="text"
                value={
                  manufacturerName
                }
                onChange={(event) =>
                  setManufacturerName(
                    event.target.value
                  )
                }
                placeholder="e.g. MikroTik"
                disabled={manufacturerSaving}
              />

              <button
                type="submit"
                className="admin-primary-button"
                disabled={manufacturerSaving}
              >
                {manufacturerSaving ? "Adding..." : "Add"}
              </button>
            </form>

            <div className="manufacturer-list">
              {manufacturers.length === 0 ? (
                <p className="admin-empty">
                  No manufacturers yet.
                </p>
              ) : (
                manufacturers.map(
                  (manufacturer) => {
                    const isEditing =
                      editingManufacturerId ===
                      manufacturer.id;

                    if (isEditing) {
                      return (
                        <div
                          className="manufacturer-item manufacturer-item-editing"
                          key={manufacturer.id}
                        >
                          <input
                            type="text"
                            value={
                              editingManufacturerName
                            }
                            onChange={(event) =>
                              setEditingManufacturerName(
                                event.target
                                  .value
                              )
                            }
                            autoFocus
                          />

                          <div className="manufacturer-actions">
                            <button
                              type="button"
                              className="admin-primary-button"
                              onClick={
                                saveManufacturerEdit
                              }
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              className="admin-secondary-button"
                              onClick={
                                cancelManufacturerEdit
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        className="manufacturer-item"
                        key={manufacturer.id}
                      >
                        <span>
                          {manufacturer.name}
                        </span>

                        <div className="manufacturer-actions">
                          <button
                            type="button"
                            className="admin-secondary-button"
                            onClick={() =>
                              startManufacturerEdit(
                                manufacturer
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-danger-button"
                            onClick={() =>
                              deleteManufacturer(
                                manufacturer
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </section>
        </div>

        {/* =================================================
            PRODUCTS LIST
        ================================================= */}

        <section className="admin-panel admin-products-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-label">
                CATALOGUE
              </span>

              <h2>
                Products
              </h2>
            </div>

            <span className="admin-count">
              Showing {filteredProducts.length} of{" "}
              {products.length} product
              {products.length === 1
                ? ""
                : "s"}
            </span>
          </div>

          {/* =================================================
              PRODUCT FILTERS
          ================================================= */}

          <div className="admin-filters">
            <div className="admin-search">
              <label htmlFor="product-search">
                SEARCH
              </label>

              <input
                id="product-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder="Name, model or manufacturer..."
              />
            </div>

            <div className="admin-filter-group">
              <label htmlFor="category-filter">
                CATEGORY
              </label>

              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All categories
                </option>

                {categories.map(
                  (category) => (
                    <option
                      value={category.id}
                      key={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="admin-filter-group">
              <label htmlFor="manufacturer-filter">
                MANUFACTURER
              </label>

              <select
                id="manufacturer-filter"
                value={
                  manufacturerFilter
                }
                onChange={(event) =>
                  setManufacturerFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All manufacturers
                </option>

                {manufacturers.map(
                  (manufacturer) => (
                    <option
                      value={manufacturer.id}
                      key={manufacturer.id}
                    >
                      {manufacturer.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="admin-filter-group">
              <label htmlFor="availability-filter">
                STATUS
              </label>

              <select
                id="availability-filter"
                value={
                  availabilityFilter
                }
                onChange={(event) =>
                  setAvailabilityFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All
                </option>

                <option value="available">
                  Available
                </option>

                <option value="hidden">
                  Hidden
                </option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="admin-clear-filters"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          {/* =================================================
              PRODUCT RESULTS
          ================================================= */}

          {loading ? (
            <p>Loading products...</p>
          ) : filteredProducts.length ===
            0 ? (
            <div className="admin-empty-products">
              <h3>
                {products.length === 0
                  ? "No products yet."
                  : "No matching products."}
              </h3>

              <p>
                {products.length === 0
                  ? "Add your first product using the form above."
                  : "Try changing your search or filters."}
              </p>

              {products.length > 0 &&
                hasActiveFilters && (
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}
            </div>
          ) : (
            <div className="admin-product-list">
              {filteredProducts.map(
                (product) => (
                  <article
                    className="admin-product-row"
                    key={product.id}
                  >
                    <div className="admin-product-main">
                      <div className="admin-product-placeholder">
                        {product.image_url ? (
                          <img
                            src={
                              product.image_url
                            }
                            alt=""
                          />
                        ) : (
                          <span>
                            IMAGE
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="admin-product-brand">
                          {product.manufacturer}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                        <span className="admin-product-model">
                          {product.model ||
                            "No model specified"}
                        </span>
                      </div>
                    </div>

                    <div className="admin-product-meta">
                      <span>
                        {getCategoryName(product.category)}
                      </span>

                      <span>
                        {product.show_price &&
                        product.price !==
                          null &&
                        product.price !==
                          undefined
                          ? `₦${Number(
                              product.price
                            ).toLocaleString(
                              "en-NG"
                            )}`
                          : "Request a quote"}
                      </span>

                      <span
                        className={
                          product.available
                            ? "status-available"
                            : "status-unavailable"
                        }
                      >
                        {product.available
                          ? "Available"
                          : "Hidden"}
                      </span>
                    </div>

                    <div className="admin-product-actions">
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                          toggleAvailability(
                            product
                          )
                        }
                        disabled={Boolean(activeProductAction)}
                      >
                        {activeProductAction ===
                        `availability-${product.id}`
                          ? "Updating..."
                          : product.available
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={() =>
                          editProduct(
                            product
                          )
                        }
                        disabled={Boolean(activeProductAction)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-danger-button"
                        onClick={() =>
                          deleteProduct(
                            product
                          )
                        }
                        disabled={Boolean(activeProductAction)}
                      >
                        {activeProductAction ===
                        `delete-${product.id}`
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Admin;
