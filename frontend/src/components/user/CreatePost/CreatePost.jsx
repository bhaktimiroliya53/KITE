import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import "../../../styles/user/createpost-page.css";
import API from "../../../services/api";
import { useEffect, useRef, useState } from "react";
import kiteIcon from "../../../assets/logo/kite-icon.png";
import { uploadPostImage } from "../../../services/uploadManager";


function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 5);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [audience, setAudience] = useState("everyone");
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [mood, setMood] = useState("");
  const [moodOpen, setMoodOpen] = useState(false);
  const [taggedPeople, setTaggedPeople] = useState([]);
  const [tagPeopleOpen, setTagPeopleOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [musicOpen, setMusicOpen] = useState(false);
  const [musicSearch, setMusicSearch] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [musicResults, setMusicResults] = useState([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState("");
  const [playingMusicId, setPlayingMusicId] = useState(null);
  const audioRef = useRef(null);

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));

      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const rotationRad = (rotation * Math.PI) / 180;

    const sin = Math.abs(Math.sin(rotationRad));
    const cos = Math.abs(Math.cos(rotationRad));

    const rotatedWidth =
      image.naturalWidth * cos + image.naturalHeight * sin;

    const rotatedHeight =
      image.naturalWidth * sin + image.naturalHeight * cos;

    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;

    ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
    ctx.rotate(rotationRad);

    ctx.drawImage(
      image,
      -image.naturalWidth / 2,
      -image.naturalHeight / 2
    );

    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create cropped image"));
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        0.92
      );
    });
  };

  useEffect(() => {
    if (!image) {
      setPreviewUrl(imageUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image, imageUrl]);


  useEffect(() => {
    const savedDraft = localStorage.getItem("kite_create_draft");

    if (!savedDraft) {
      setDraftReady(true);
      return;
    }

    try {
      const draft = JSON.parse(savedDraft);

      setCaption(draft.caption || "");
      setImageUrl(draft.imageUrl || "");
      setZoom(draft.zoom ?? 1);
      setRotation(draft.rotation ?? 0);
      setAspectRatio(draft.aspectRatio ?? 4 / 5);
      setCrop(draft.crop || { x: 0, y: 0 });
      setTaggedPeople(draft.taggedPeople || []);
      setSelectedMusic(draft.music || null);
      setAudience(draft.audience || "everyone");
      setMood(draft.mood || "");
    } catch (error) {
      console.error("DRAFT RESTORE ERROR =>", error);
      localStorage.removeItem("kite_create_draft");
    }

    setDraftReady(true);
  }, []);


  useEffect(() => {
    if (!tagPeopleOpen) return;

    const loadUsers = async () => {
      try {
        const response = await API.get("/users");

        const userList = Array.isArray(response.data)
          ? response.data
          : response.data.users || [];

        setUsers(userList);
      } catch (error) {
        console.error("LOAD USERS ERROR =>", error);
      }
    };

    loadUsers();
  }, [tagPeopleOpen]);


  useEffect(() => {
    if (!draftReady) return;

    const draft = {
      caption,
      imageUrl,
      zoom,
      rotation,
      aspectRatio,
      crop,
      audience,
      mood,
      taggedPeople,
      music: selectedMusic,
    };

    localStorage.setItem(
      "kite_create_draft",
      JSON.stringify(draft)
    );

    setDraftSaved(true);

    const timer = setTimeout(() => {
      setDraftSaved(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    draftReady,
    caption,
    imageUrl,
    zoom,
    rotation,
    aspectRatio,
    crop,
    audience,
    mood,
    taggedPeople,
    selectedMusic,
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImageUrl("");
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl("");
    setPreviewUrl("");
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          const address = data.address || {};

          const locationName =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "Current location";

          const stateName = address.state || "";

          setLocation({
            latitude,
            longitude,
            name: locationName,
            state: stateName,
            displayName: data.display_name || locationName,
          });

          setLocationLoading(false);
        } catch (error) {
          console.error("REVERSE LOCATION ERROR =>", error);

          setLocation({
            latitude,
            longitude,
            name: "Current location",
            state: "",
          });

          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("LOCATION ERROR =>", error);

        setLocationLoading(false);
        setLocationError("Unable to get your location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handleSearchLocation = async () => {
    const query = locationSearch.trim();

    if (!query) {
      setLocationResults([]);
      return;
    }

    try {
      setLocationLoading(true);
      setLocationError("");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      setLocationResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOCATION SEARCH ERROR =>", error);
      setLocationError("Unable to search locations.");
      setLocationResults([]);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSearchMusic = async () => {
    const query = musicSearch.trim();

    if (!query) {
      setMusicResults([]);
      setMusicError("");
      return;
    }

    try {
      setMusicLoading(true);
      setMusicError("");

      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&country=IN&media=music&entity=song&limit=10`
      );

      if (!response.ok) {
        throw new Error("Music search failed");
      }

      const data = await response.json();

      const songs = Array.isArray(data.results)
        ? data.results.filter((song) => song.previewUrl)
        : [];

      setMusicResults(songs);

      if (songs.length === 0) {
        setMusicError("No songs found. Try another search.");
      }
    } catch (error) {
      console.error("MUSIC SEARCH ERROR =>", error);
      setMusicError("Unable to search music right now.");
      setMusicResults([]);
    } finally {
      setMusicLoading(false);
    }
  };

  const handleToggleMusicPreview = (song) => {
    if (!song?.previewUrl) return;

    if (playingMusicId === song.id) {
      audioRef.current?.pause();
      setPlayingMusicId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(song.previewUrl);

    audioRef.current = audio;

    audio.onended = () => {
      setPlayingMusicId(null);
    };

    audio.onerror = () => {
      setPlayingMusicId(null);
      alert("Unable to play music preview.");
    };

    audio.play()
      .then(() => {
        setPlayingMusicId(song.id);
      })
      .catch(() => {
        setPlayingMusicId(null);
        alert("Unable to play music preview.");
      });
  };


  const handlePost = async () => {
    if (isPosting) return;

    try {
      if (!caption.trim() && !image && !imageUrl.trim()) {
        alert("Write something or add an image!");
        return;
      }

      setIsPosting(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) {
        alert("Please login again.");
        return;
      }

      let finalImageUrl = imageUrl.trim();

      // Upload edited/cropped image to Cloudinary
      if (image) {
        if (!croppedAreaPixels) {
          throw new Error("Please wait for the image editor to finish.");
        }

        const croppedBlob = await getCroppedImg(
          previewUrl,
          croppedAreaPixels,
          rotation
        );

        uploadPostImage({
          imageBlob: croppedBlob,
          postPayload: {
            content: caption.trim(),
            userId: user._id,
            taggedPeople: taggedPeople.map((person) => person._id),
            audience,
            mood,
            location,
            music: selectedMusic,
          },
        });

        navigate("/home");
        return;
      }

      // Create post
      await API.post("/posts", {
        content: caption.trim(),
        image: finalImageUrl,
        userId: user._id,
        taggedPeople: taggedPeople.map((person) => person._id),
        audience,
        mood,
        location,
        music: selectedMusic,
      });

      localStorage.removeItem("kite_create_draft");

      // Back to Create page after successful publish
      navigate("/create");
    } catch (error) {
      console.error("CREATE POST ERROR =>", error);
      alert("Something went wrong while publishing your post.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">
        {/* HEADER */}
        <div className="moment-header">
          <button
            className="moment-back"
            onClick={() => navigate("/create")}
          >
            ←
          </button>

          <div>
            <span className="moment-eyebrow">KITE MOMENT</span>
            <h2>Create a moment</h2>
            <p>Share something worth remembering.</p>
            {draftSaved && (
              <span className="draft-saved-indicator">
                ✓ Draft saved
              </span>
            )}
          </div>
        </div>

        {/* CAPTION */}
        <div className="moment-caption-section">
          <div className="moment-label-row">
            <label className="moment-section-label">
              WHAT'S ON YOUR MIND?
            </label>

            <span className="caption-counter">
              {caption.length}/500
            </span>
          </div>

          <textarea
            placeholder="Share a thought, feeling, idea or moment..."
            value={caption}
            maxLength={500}
            onChange={(e) => setCaption(e.target.value)}
            autoFocus
          />
        </div>

        {/* MEDIA AREA */}

        {previewUrl ? (
          <div className="moment-preview-wrapper">
            <Cropper
              image={previewUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />

            <button
              className="moment-remove-image"
              onClick={removeImage}
              type="button"
            >
              ×
            </button>

            <label className="change-image-button">
              Change image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>
        ) : (
          <label className="moment-upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <div className="upload-icon">＋</div>

            <h3>Add a photo</h3>

            <p>
              Add an image to make your moment visual
              <br />
              or simply continue with text.
            </p>

            <span className="upload-hint">
              JPG, PNG, WEBP • Up to 10 MB
            </span>
          </label>
        )}

        <div className="moment-edit-controls">

          <div className="edit-control">
            <div className="edit-control-header">
              <span>Zoom</span>
              <span>{zoom.toFixed(1)}×</span>
            </div>

            <div className="edit-slider-row">
              <button
                type="button"
                className="edit-small-button"
                onClick={() =>
                  setZoom((value) => Math.max(1, Number((value - 0.1).toFixed(1))))
                }
              >
                −
              </button>

              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />

              <button
                type="button"
                className="edit-small-button"
                onClick={() =>
                  setZoom((value) => Math.min(3, Number((value + 0.1).toFixed(1))))
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="edit-control">
            <div className="edit-control-header">
              <span>Rotation</span>
              <span>{rotation}°</span>
            </div>

            <div className="edit-slider-row">
              <button
                type="button"
                className="edit-small-button"
                onClick={() =>
                  setRotation((value) => Math.max(-180, value - 5))
                }
              >
                ↶
              </button>

              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
              />

              <button
                type="button"
                className="edit-small-button"
                onClick={() =>
                  setRotation((value) => Math.min(180, value + 5))
                }
              >
                ↷
              </button>
            </div>
          </div>

          <div className="edit-quick-tools">
            <button
              type="button"
              onClick={() =>
                setRotation((value) => (value - 90 < -180 ? 180 : value - 90))
              }
            >
              ↶ 90°
            </button>

            <button
              type="button"
              onClick={() =>
                setRotation((value) => (value + 90 > 180 ? -180 : value + 90))
              }
            >
              ↷ 90°
            </button>
          </div>

          <button
            type="button"
            className="reset-edit-button"
            onClick={() => {
              setCrop({ x: 0, y: 0 });
              setZoom(1);
              setRotation(0);
            }}
          >
            Reset
          </button>

        </div>

        <div className="aspect-ratio-controls">
          <button
            type="button"
            className={aspectRatio === 4 / 5 ? "active" : ""}
            onClick={() => setAspectRatio(4 / 5)}
          >
            4:5
          </button>

          <button
            type="button"
            className={aspectRatio === 1 ? "active" : ""}
            onClick={() => setAspectRatio(1)}
          >
            1:1
          </button>

          <button
            type="button"
            className={aspectRatio === 16 / 9 ? "active" : ""}
            onClick={() => setAspectRatio(16 / 9)}
          >
            16:9
          </button>
        </div>

        {/* IMAGE URL */}
        <div className="moment-url-section">
          <button
            type="button"
            className="url-toggle"
            onClick={() => {
              setImage(null);
              setPreviewUrl("");
            }}
          >
            Or use an image URL
          </button>

          <input
            type="text"
            placeholder="Paste image URL..."
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImage(null);
            }}
          />
        </div>



        {/* new TOOLS */}
        <div className="moment-tools">
          <div className="mood-selector">
            <button
              type="button"
              onClick={() => setMoodOpen((value) => !value)}
            >
              <span>{mood ? mood.split(" ")[0] : "✨"}</span>
              {mood ? mood.substring(mood.indexOf(" ") + 1) : "Mood"}
            </button>

            {moodOpen && (
              <div className="mood-menu">
                {[
                  "😊 Happy",
                  "😎 Chill",
                  "❤️ Loved",
                  "🔥 Excited",
                  "😌 Peaceful",
                  "🤔 Thoughtful",
                  "🥳 Celebrating",
                  "💪 Motivated",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={mood === item ? "selected" : ""}
                    onClick={() => {
                      setMood(item);
                      setMoodOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}

                <button
                  type="button"
                  className="clear-mood"
                  onClick={() => {
                    setMood("");
                    setMoodOpen(false);
                  }}
                >
                  Clear mood
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setLocationOpen(true);
              handleGetLocation();
            }}
          >
            <span>📍</span>
            {location ? "Location added" : "Location"}
          </button>

          <div className="tag-people-selector">
            <button
              type="button"
              onClick={() => setTagPeopleOpen((value) => !value)}
            >
              <span>👤</span>
              {taggedPeople.length > 0
                ? `${taggedPeople.length} tagged`
                : "Tag people"}
            </button>

            {tagPeopleOpen && (
              <div className="tag-people-menu">
                <input
                  type="text"
                  placeholder="Search people..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  autoFocus
                />

                <div className="tag-people-list">
                  {users
                    .filter((user) => {
                      const name = user.username || user.name || "";
                      return name
                        .toLowerCase()
                        .includes(userSearch.toLowerCase());
                    })
                    .slice(0, 8)
                    .map((user) => {
                      const userId = user._id;

                      const isSelected = taggedPeople.some(
                        (person) => person._id === userId
                      );

                      return (
                        <button
                          type="button"
                          key={userId}
                          className={isSelected ? "selected" : ""}
                          onClick={() => {
                            setTaggedPeople((current) => {
                              if (isSelected) {
                                return current.filter(
                                  (person) => person._id !== userId
                                );
                              }

                              return [...current, user];
                            });
                          }}
                        >
                          <div className="tag-user-avatar">
                            {(
                              user.username ||
                              user.name ||
                              "U"
                            ).charAt(0).toUpperCase()}
                          </div>

                          <div className="tag-user-info">
                            <strong>
                              {user.username || user.name || "User"}
                            </strong>
                            {user.email && <small>{user.email}</small>}
                          </div>

                          {isSelected && <span>✓</span>}
                        </button>
                      );
                    })}

                  {users.length === 0 && (
                    <p className="tag-empty">No users found.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMusicOpen(true)}
          >
            <span>🎵</span>
            {selectedMusic ? selectedMusic.title : "Sound"}
          </button>

        </div>

        {/* LOCATION */}
        {locationOpen && (
          <div className="location-modal">
            <div className="location-modal-card">

              <div className="location-modal-header">
                <div>
                  <span className="location-eyebrow">KITE LOCATION</span>
                  <h3>Add location</h3>
                  <p>Attach your current location to this moment.</p>
                </div>

                <button
                  type="button"
                  className="location-close"
                  onClick={() => setLocationOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="location-search-box">
                <input
                  type="text"
                  placeholder="Search a place, city or landmark..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                />

                <button
                  type="button"
                  onClick={handleSearchLocation}
                  disabled={locationLoading || !locationSearch.trim()}
                >
                  {locationLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {locationResults.length > 0 && (
                <div className="location-results">
                  {locationResults.map((result) => (
                    <button
                      type="button"
                      className="location-result-item"
                      key={result.place_id}
                      onClick={() => {
                        setLocation({
                          latitude: Number(result.lat),
                          longitude: Number(result.lon),
                          name: result.display_name,
                        });

                        setLocationSearch(result.display_name);
                        setLocationResults([]);
                      }}
                    >
                      <span className="location-result-pin">📍</span>

                      <div>
                        <strong>
                          {result.name || result.display_name.split(",")[0]}
                        </strong>

                        <small>{result.display_name}</small>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {locationLoading && (
                <div className="location-status">
                  <div className="location-spinner">📍</div>
                  <strong>Getting your location...</strong>
                  <p>Please allow location access when your browser asks.</p>
                </div>
              )}

              {!locationLoading && locationError && (
                <div className="location-status location-error">
                  <div className="location-spinner">⚠️</div>
                  <strong>Couldn't get your location</strong>
                  <p>{locationError}</p>

                  <button
                    type="button"
                    onClick={handleGetLocation}
                  >
                    Try again
                  </button>
                </div>
              )}

              {!locationLoading && !locationError && location && (
                <div className="location-result">
                  <div className="location-result-icon">📍</div>

                  <div>
                    <strong>Current location detected</strong>
                    <p>
                      Latitude: {location.latitude.toFixed(6)}
                      <br />
                      Longitude: {location.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              <div className="location-modal-actions">
                <button
                  type="button"
                  className="location-cancel"
                  onClick={() => setLocationOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="location-add"
                  disabled={!location || locationLoading}
                  onClick={() => setLocationOpen(false)}
                >
                  Add Location
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MUSIC */}
        {musicOpen && (
          <div className="music-modal">
            <div className="music-modal-card">

              <div className="music-modal-header">
                <div>
                  <span className="music-eyebrow">KITE MUSIC</span>
                  <h3>Add music</h3>
                  <p>Find a song that matches your moment.</p>
                </div>

                <button
                  type="button"
                  className="music-close"
                  onClick={() => setMusicOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="music-search-box">
                <input
                  type="text"
                  placeholder="Search songs or artists..."
                  value={musicSearch}
                  onChange={(e) => setMusicSearch(e.target.value)}
                />

                <button
                  type="button"
                  onClick={handleSearchMusic}
                  disabled={musicLoading || !musicSearch.trim()}
                >
                  {musicLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {musicLoading && (
                <div className="music-empty-state">
                  <div className="music-empty-icon">🎵</div>

                  <strong>Searching music...</strong>

                  <p>
                    Finding songs that match your search.
                  </p>
                </div>
              )}

              {!musicLoading && musicError && (
                <div className="music-empty-state">
                  <div className="music-empty-icon">🎵</div>

                  <strong>{musicError}</strong>

                  <p>
                    Try searching for another song or artist.
                  </p>
                </div>
              )}

              {!musicLoading &&
                !musicError &&
                musicResults.length === 0 && (
                  <div className="music-empty-state">
                    <div className="music-empty-icon">🎵</div>

                    <strong>Search for a song</strong>

                    <p>
                      Find music to add to your KITE moment.
                    </p>
                  </div>
                )}

              {!musicLoading && musicResults.length > 0 && (
                <div className="music-results">
                  {musicResults.map((song) => (
                    <div
                      className="music-result-item"
                      key={song.trackId}
                    >
                      <img
                        src={song.artworkUrl100}
                        alt=""
                        className="music-result-artwork"
                      />

                      <div className="music-result-info">
                        <strong>{song.trackName}</strong>

                        <span>{song.artistName}</span>

                        <small>{song.collectionName}</small>
                      </div>

                      <button
                        type="button"
                        className="music-preview-button"
                        onClick={() =>
                          handleToggleMusicPreview({
                            id: song.trackId,
                            previewUrl: song.previewUrl,
                          })
                        }
                      >
                        {playingMusicId === song.trackId ? "⏸" : "▶"}
                      </button>

                      <button
                        type="button"
                        className="music-select-button"
                        onClick={() => {
                          setSelectedMusic({
                            id: song.trackId,
                            title: song.trackName,
                            artist: song.artistName,
                            album: song.collectionName,
                            artwork: song.artworkUrl100,
                            previewUrl: song.previewUrl,
                            trackUrl: song.trackViewUrl,
                          });

                          setPlayingMusicId(null);
                          setMusicOpen(false);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="music-modal-actions">
                <button
                  type="button"
                  className="music-cancel"
                  onClick={() => setMusicOpen(false)}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

        {selectedMusic && (
          <div className="selected-music-card">
            <img
              src={selectedMusic.artwork}
              alt=""
              className="selected-music-artwork"
            />

            <div className="selected-music-info">
              <span>ADDED MUSIC</span>
              <strong>{selectedMusic.title}</strong>
              <p>{selectedMusic.artist}</p>
            </div>

            <button
              type="button"
              className="selected-music-remove"
              onClick={() => {
                setSelectedMusic(null);
                setPlayingMusicId(null);
              }}
              aria-label="Remove music"
            >
              ×
            </button>
          </div>
        )}
        {/* AUDIENCE */}
        <div className="moment-audience">
          <div className="audience-info">
            <span className="audience-icon">
              {audience === "everyone" ? "◉" : audience === "followers" ? "👥" : "🔒"}
            </span>

            <div>
              <strong>Who can see this?</strong>
              <p>
                {audience === "everyone"
                  ? "Everyone on KITE"
                  : audience === "followers"
                    ? "Only your followers"
                    : "Only you"}
              </p>
            </div>
          </div>

          <div className="audience-selector">
            <button
              type="button"
              className="audience-select-button"
              onClick={() => setAudienceOpen((value) => !value)}
            >
              {audience === "everyone"
                ? "Everyone"
                : audience === "followers"
                  ? "Followers"
                  : "Only me"}

              <span>{audienceOpen ? "⌃" : "⌄"}</span>
            </button>

            {audienceOpen && (
              <div className="audience-menu">
                <button
                  type="button"
                  className={audience === "everyone" ? "selected" : ""}
                  onClick={() => {
                    setAudience("everyone");
                    setAudienceOpen(false);
                  }}
                >
                  <span>◉</span>
                  <div>
                    <strong>Everyone</strong>
                    <small>Everyone on KITE can see this</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={audience === "followers" ? "selected" : ""}
                  onClick={() => {
                    setAudience("followers");
                    setAudienceOpen(false);
                  }}
                >
                  <span>👥</span>
                  <div>
                    <strong>Followers</strong>
                    <small>Only your followers can see this</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={audience === "private" ? "selected" : ""}
                  onClick={() => {
                    setAudience("private");
                    setAudienceOpen(false);
                  }}
                >
                  <span>🔒</span>
                  <div>
                    <strong>Only me</strong>
                    <small>This post will be private</small>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="moment-actions">
          <button
            className="moment-cancel"
            onClick={() => navigate("/create")}
            type="button"
          >
            Cancel
          </button>

          <button
            className="moment-publish"
            onClick={handlePost}
            type="button"
            disabled={isPosting}
          >
            {isPosting ? (
              "Publishing..."
            ) : (
              <>
                Publish
                <img
                  src={kiteIcon}
                  alt="KITE"
                  className="publish-kite-logo"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;