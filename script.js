// ============================================
// API CONFIGURATION
// ============================================
const API_URL = 'https://church-backend-h2ch.onrender.com/api';

// ============================================
// HELPER FUNCTIONS
// ============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// WELCOME FUNCTION
// ============================================

function showWelcome() {
    alert("Welcome to Gethsemane Methodist Church, Baatsona! Join us Sunday at 8 AM.");
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn) {
    menuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a, .dropdown-trigger').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks) {
            navLinks.classList.remove('active');
        }
    });
});

// ============================================
// ORGANIZATIONS
// ============================================

async function fetchOrganizations() {
    try {
        const response = await fetch(`${API_URL}/organizations`);
        if (!response.ok) throw new Error('Failed to fetch organizations');
        const organizations = await response.json();
        displayOrganizations(organizations);
    } catch (error) {
        console.error('Error fetching organizations:', error);
        displayFallbackOrganizations();
    }
}

function displayOrganizations(organizations) {
    const grid = document.getElementById('orgsGrid');
    if (!grid) return;
    
    if (organizations.length === 0) {
        grid.innerHTML = '<div class="org-card"><p>No organizations yet. Check back soon!</p></div>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < organizations.length; i++) {
        const org = organizations[i];
        const plainTextDesc = org.description.replace(/<[^>]*>/g, '');
        const shortDesc = plainTextDesc.length > 80 ? plainTextDesc.substring(0, 80) + '...' : plainTextDesc;
        
        html += `
            <div class="org-card">
                <div class="org-icon">${org.icon || '📌'}</div>
                <h3 class="org-name">${escapeHtml(org.name)}</h3>
                <p class="org-meeting">📅 ${escapeHtml(org.meeting)}</p>
                <div class="org-description">${escapeHtml(shortDesc)}</div>
                <button class="learn-more-org-btn" onclick="openOrgProfile('${org._id}')">Learn More →</button>
            </div>
        `;
    }
    grid.innerHTML = html;
}

function openOrgProfile(orgId) {
    if (orgId) {
        window.location.href = `organization.html?id=${orgId}`;
    }
}

function displayFallbackOrganizations() {
    const grid = document.getElementById('orgsGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="org-card"><p>Unable to load organizations. Please refresh.</p></div>';
}

async function showOrgProfile(orgId) {
    try {
        const response = await fetch(`${API_URL}/organizations/${orgId}`);
        if (!response.ok) throw new Error('Failed to fetch organization details');
        const org = await response.json();
        
        const modal = document.getElementById('orgModal');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = `
            <div style="text-align: center;">
                ${org.logoLarge ? 
                    `<img src="${org.logoLarge}" alt="${org.name} Logo" class="org-logo-large">` : 
                    `<div style="font-size: 64px; margin-bottom: 15px;">📌</div>`
                }
                <h2 style="color: #2c3e50; margin-bottom: 10px;">${escapeHtml(org.name)}</h2>
            </div>
            <div class="org-profile-section">
                <h4>📅 Meeting Time</h4>
                <p>${escapeHtml(org.meeting)}</p>
            </div>
            <div class="org-profile-section">
                <h4>📋 About This Ministry</h4>
                <p>${escapeHtml(org.description)}</p>
            </div>
            <div class="org-profile-section">
                <h4>👤 Ministry Leader</h4>
                <p>${escapeHtml(org.leader)}</p>
            </div>
            <div class="org-profile-section">
                <h4>📍 Location</h4>
                <p>${escapeHtml(org.location)}</p>
            </div>
            <div class="org-profile-section">
                <h4>📧 Contact</h4>
                <p>${escapeHtml(org.email)}</p>
            </div>
            <button class="org-contact-btn" onclick="contactOrganization('${escapeHtml(org.name)}')">
                📞 Contact This Ministry
            </button>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching organization details:', error);
        alert('Unable to load organization details');
    }
}

function closeModal() {
    const modal = document.getElementById('orgModal');
    if (modal) modal.style.display = 'none';
}

function contactOrganization(orgName) {
    alert(`Thank you for your interest in ${orgName}!\n\nPlease call the church office for more information.`);
    closeModal();
}

// ============================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ============================================

window.onclick = function(event) {
    const modal = document.getElementById('orgModal');
    if (event.target === modal) modal.style.display = 'none';
    const leaderModal = document.getElementById('leaderModal');
    if (event.target === leaderModal) leaderModal.style.display = 'none';
    const advertModal = document.getElementById('advertModal');
    if (event.target === advertModal) advertModal.style.display = 'none';
};

// ============================================
// SOCIAL MEDIA FUNCTIONS
// ============================================

function openSocial(platform) {
    let url = '';
    let message = '';
    
    switch(platform) {
        case 'facebook': url = 'https://facebook.com/yourchurch'; message = 'Facebook page'; break;
        case 'youtube': url = 'https://youtube.com/@yourchurch'; message = 'YouTube channel'; break;
        case 'tiktok': url = 'https://tiktok.com/@yourchurch'; message = 'TikTok page'; break;
        case 'instagram': url = 'https://instagram.com/yourchurch'; message = 'Instagram page'; break;
        default: url = '#'; message = 'social media';
    }
    alert(`📱 Opening our ${message}\n\nIn a real website, this would open:\n${url}`);
}

// ============================================
// ANNOUNCEMENTS
// ============================================

async function fetchAnnouncements() {
    try {
        const response = await fetch(`${API_URL}/announcements`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const announcements = await response.json();
        displayAnnouncements(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        displayFallbackAnnouncements();
    }
}

function displayAnnouncements(announcements) {
    const container = document.getElementById('announcementsList');
    if (!container) return;
    
    if (announcements.length === 0) {
        container.innerHTML = '<div class="announcement-item">No announcements yet. Check back soon!</div>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < announcements.length; i++) {
        const announcement = announcements[i];
        const displayDate = announcement.date || (announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString() : 'Recent');
        html += `
            <div class="announcement-item">
                <div class="announcement-title">📢 ${escapeHtml(announcement.title)}</div>
                <div class="announcement-date">📅 ${displayDate}</div>
                <div class="announcement-text">${escapeHtml(announcement.content)}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function displayFallbackAnnouncements() {
    const container = document.getElementById('announcementsList');
    if (!container) return;
    container.innerHTML = `<div class="announcement-item"><div class="announcement-title">📢 Unable to load announcements</div><div class="announcement-text">Please check your connection.</div></div>`;
}

// ============================================
// EVENTS
// ============================================

async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        displayFallbackEvents();
    }
}

function displayEvents(events) {
    const container = document.getElementById('eventsList');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<div class="event-card">No upcoming events. Check back soon!</div>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        let posterPath = event.poster;
        if (posterPath && !posterPath.startsWith('http') && !posterPath.startsWith('/')) {
            posterPath = '/' + posterPath;
        }
        
        html += `
            <div class="event-card">
                <div class="event-poster" onclick="viewPoster('${posterPath}')" style="cursor: pointer;">
                    ${event.poster ? 
                        `<img src="${posterPath}" alt="${escapeHtml(event.title)} Poster" style="width: 100%; height: 100%; object-fit: cover;">` : 
                        `<div class="event-poster-placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea, #764ba2); color: white;"><span>📅</span></div>`
                    }
                </div>
                <div class="event-details">
                    <h3 class="event-title">${escapeHtml(event.title)}</h3>
                    <div class="event-info">
                        <span class="event-date">📅 ${escapeHtml(event.date)}</span>
                        <span class="event-time">⏰ ${escapeHtml(event.time)}</span>
                    </div>
                    <p class="event-description">${escapeHtml(event.description)}</p>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function displayFallbackEvents() {
    const container = document.getElementById('eventsList');
    if (!container) return;
    container.innerHTML = `<div class="event-card"><div class="event-details"><h3 class="event-title">Unable to load events</h3><p class="event-description">Please refresh the page.</p></div></div>`;
}

function viewPoster(posterUrl) {
    let imageUrl = posterUrl;
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
    }
    
    const modal = document.createElement('div');
    modal.className = 'poster-modal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.95); z-index: 99999; display: flex; align-items: center; justify-content: center; cursor: pointer;`;
    modal.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%;">
            <span style="position: absolute; top: -50px; right: -10px; color: white; font-size: 40px; font-weight: bold; cursor: pointer; background: rgba(0,0,0,0.6); width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10;">&times;</span>
            <img src="${imageUrl}" alt="Event Poster" style="max-width: 100%; max-height: 85vh; border-radius: 10px; box-shadow: 0 5px 30px rgba(0,0,0,0.5);">
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.onclick = function(e) {
        if (e.target === modal || e.target.tagName === 'SPAN') modal.remove();
    };
    
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', function() { document.body.style.overflow = 'auto'; });
}

function registerForEvent(eventName) {
    alert(`Thank you for your interest in "${eventName}"!\n\nPlease call the church office to register.`);
}

// ============================================
// BLOGS
// ============================================

async function fetchBlogs(limit = 3) {
    try {
        const response = await fetch(`${API_URL}/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const allBlogs = await response.json();
        window.allBlogs = allBlogs;
        const latestBlogs = allBlogs.slice(0, limit);
        displayBlogs(latestBlogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        displayFallbackBlogs();
    }
}

function displayBlogs(blogs) {
    const container = document.getElementById('blogsList');
    if (!container) return;
    
    if (blogs.length === 0) {
        container.innerHTML = '<div class="blog-post">No blog posts yet. Check back soon!</div>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        const plainTextExcerpt = blog.excerpt ? blog.excerpt.replace(/<[^>]*>/g, '') : '';
        html += `
            <div class="blog-post" onclick="openBlog('${escapeHtml(blog.title)}', '${blog._id}')">
                <div class="blog-title">📝 ${escapeHtml(blog.title)}</div>
                <div class="blog-meta">✍️ ${escapeHtml(blog.author)} | 📅 ${blog.date} | ⏱️ ${blog.readTime || '5 min read'}</div>
                <div class="blog-excerpt">${escapeHtml(plainTextExcerpt.substring(0, 120))}...</div>
                <a href="#" class="read-more">Read full article →</a>
            </div>
        `;
    }
    container.innerHTML = html;
}

function displayFallbackBlogs() {
    const container = document.getElementById('blogsList');
    if (!container) return;
    container.innerHTML = `<div class="blog-post"><div class="blog-title">📝 Unable to load blogs</div><div class="blog-excerpt">Please check your connection.</div></div>`;
}

function openBlog(title, blogId) {
    window.location.href = blogId ? `blog.html?id=${blogId}` : `blog.html?id=${encodeURIComponent(title)}`;
}

// ============================================
// PHOTO GALLERY
// ============================================

let photoAlbums = { worship: [], events: [], outreach: [], youth: [], missions: [] };
let currentAlbumPhotos = [];
let currentPhotoIndex = 0;

async function fetchGallery() {
    try {
        const response = await fetch(`${API_URL}/gallery`);
        const galleryData = await response.json();
        for (const album in galleryData) {
            if (photoAlbums[album] !== undefined) photoAlbums[album] = galleryData[album] || [];
        }
        if (document.getElementById('albumsGrid')) displayAlbums();
    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

function displayAlbums() {
    const container = document.getElementById('albumsGrid');
    if (!container) return;
    
    const albumInfo = {
        worship: { name: 'Divine Services', icon: '🎵' },
        events: { name: 'Special Events', icon: '🎉' },
        outreach: { name: 'Evangelism Events', icon: '🤝' },
        youth: { name: 'Children Ministry', icon: '🎸' },
        missions: { name: 'Missions', icon: '🌍' }
    };
    
    let html = '<div class="albums-grid">';
    for (const [albumId, album] of Object.entries(photoAlbums)) {
        const photoCount = album.length;
        const info = albumInfo[albumId];
        const coverUrl = album[0]?.url || `https://via.placeholder.com/400x400/4CAF50/white?text=${info?.name || albumId}`;
        html += `
            <div class="album-card" onclick="openAlbum('${albumId}')">
                <div class="album-cover" style="background-image: url('${coverUrl}')">
                    <div class="album-cover-overlay">📸 ${photoCount} photos</div>
                </div>
                <div class="album-info">
                    <div class="album-name">${info?.name || albumId}</div>
                    <div class="album-count">${photoCount} photos</div>
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function openAlbum(albumId) {
    const album = photoAlbums[albumId];
    if (!album) { alert('No photos in this album yet.'); return; }
    
    currentAlbumPhotos = album;
    const albumNames = { worship: 'Divine Services', events: 'Special Events', outreach: 'Evangelism Events', youth: 'Children Ministry', missions: 'Missions' };
    
    document.getElementById('albumView').style.display = 'none';
    document.getElementById('photosView').style.display = 'block';
    document.getElementById('currentAlbumTitle').innerHTML = `${albumNames[albumId]} (${album.length} photos)`;
    
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    if (album.length === 0) { galleryGrid.innerHTML = '<p>No photos in this album yet.</p>'; return; }
    
    let html = '';
    for (let i = 0; i < album.length; i++) {
        html += `<div class="gallery-photo" style="background-image: url('${album[i].url}'); width: 100%; height: 200px; background-size: cover; background-position: center; border-radius: 10px; cursor: pointer;" onclick="openLightbox(${i})"></div>`;
    }
    galleryGrid.innerHTML = html;
}

function openLightbox(index) {
    if (!currentAlbumPhotos || currentAlbumPhotos.length === 0) return;
    currentPhotoIndex = index;
    const photo = currentAlbumPhotos[currentPhotoIndex];
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    lightboxImage.src = photo.url;
    lightboxCaption.innerHTML = `${photo.title || 'Photo'} | ${photo.date || ''}`;
    lightboxCounter.innerHTML = `${currentPhotoIndex + 1} / ${currentAlbumPhotos.length}`;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function nextLightboxImage(event) {
    if (event) event.stopPropagation();
    if (!currentAlbumPhotos || currentAlbumPhotos.length === 0) return;
    
    currentPhotoIndex++;
    if (currentPhotoIndex >= currentAlbumPhotos.length) currentPhotoIndex = 0;
    
    const photo = currentAlbumPhotos[currentPhotoIndex];
    document.getElementById('lightboxImage').src = photo.url;
    document.getElementById('lightboxCaption').innerHTML = `${photo.title || 'Photo'} | ${photo.date || ''}`;
    document.getElementById('lightboxCounter').innerHTML = `${currentPhotoIndex + 1} / ${currentAlbumPhotos.length}`;
}

function prevLightboxImage(event) {
    if (event) event.stopPropagation();
    if (!currentAlbumPhotos || currentAlbumPhotos.length === 0) return;
    
    currentPhotoIndex--;
    if (currentPhotoIndex < 0) currentPhotoIndex = currentAlbumPhotos.length - 1;
    
    const photo = currentAlbumPhotos[currentPhotoIndex];
    document.getElementById('lightboxImage').src = photo.url;
    document.getElementById('lightboxCaption').innerHTML = `${photo.title || 'Photo'} | ${photo.date || ''}`;
    document.getElementById('lightboxCounter').innerHTML = `${currentPhotoIndex + 1} / ${currentAlbumPhotos.length}`;
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showAlbumView() {
    document.getElementById('albumView').style.display = 'block';
    document.getElementById('photosView').style.display = 'none';
    closeLightbox();
}

document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'block') {
        if (e.key === 'ArrowRight') nextLightboxImage(null);
        else if (e.key === 'ArrowLeft') prevLightboxImage(null);
        else if (e.key === 'Escape') closeLightbox();
    }
});

// ============================================
// LIVE STREAM & YOUTUBE
// ============================================

function openYouTubeChannel() {
    alert('Opening YouTube channel\n\nReplace this URL with your actual YouTube channel link.');
}

function shareLiveStream() {
    const streamUrl = window.location.href;
    if (navigator.share) {
        navigator.share({ title: 'Church Live Stream', text: 'Join us for worship live!', url: streamUrl });
    } else {
        alert(`Share this link with friends and family:\n${streamUrl}`);
    }
}

let featuredVideo = { videoId: '', title: 'Featured Message' };

async function fetchYouTubeVideo() {
    try {
        const response = await fetch(`${API_URL}/youtube`);
        const data = await response.json();
        featuredVideo = data;
        updateYouTubePlayer();
    } catch (error) {
        console.error('Error fetching YouTube video:', error);
    }
}

function updateYouTubePlayer() {
    const iframe = document.getElementById('youtubePlayer');
    if (iframe && featuredVideo.videoId) iframe.src = `https://www.youtube.com/embed/${featuredVideo.videoId}`;
    const titleElement = document.querySelector('.stream-info h3');
    if (titleElement && featuredVideo.title) titleElement.textContent = featuredVideo.title;
}

// ============================================
// LEADERS
// ============================================

async function fetchLeaders() {
    try {
        const response = await fetch(`${API_URL}/leaders`);
        if (!response.ok) throw new Error('Failed to fetch leaders');
        const leaders = await response.json();
        displayLeaders(leaders);
    } catch (error) {
        console.error('Error fetching leaders:', error);
        displayFallbackLeaders();
    }
}

function displayLeaders(leaders) {
    const container = document.getElementById('leadersGrid');
    if (!container) return;
    if (leaders.length === 0) { container.innerHTML = '<div class="leader-card"><p>No leaders yet. Check back soon!</p></div>'; return; }
    
    let html = '';
    for (let i = 0; i < leaders.length; i++) {
        const leader = leaders[i];
        html += `
            <div class="leader-card">
                <div class="leader-photo"><img src="${leader.photo || ''}" alt="${escapeHtml(leader.name)}" onerror="this.src='https://via.placeholder.com/400x400/2c3e50/white?text=No+Photo'"></div>
                <div class="leader-info">
                    <h3 class="leader-name">${escapeHtml(leader.name)}</h3>
                    <p class="leader-title">${escapeHtml(leader.title)}</p>
                    <button class="read-more-btn" onclick="showLeaderProfile('${leader._id}')">Read More →</button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function displayFallbackLeaders() {
    const container = document.getElementById('leadersGrid');
    if (!container) return;
    container.innerHTML = '<div class="leader-card"><p>Unable to load leaders. Please refresh.</p></div>';
}

async function showLeaderProfile(leaderId) {
    try {
        const response = await fetch(`${API_URL}/leaders/${leaderId}`);
        if (!response.ok) throw new Error(`Failed to fetch leader details (status: ${response.status})`);
        const leader = await response.json();
        
        const modal = document.getElementById('leaderModal');
        const modalContent = document.getElementById('leaderModalContent');
        if (!modal || !modalContent) return;
        
        modalContent.innerHTML = `
            <div class="leader-profile">
                <div class="leader-profile-photo"><img src="${leader.photo || ''}" alt="${escapeHtml(leader.name)}" onerror="this.src='https://via.placeholder.com/300x300/2c3e50/white?text=No+Photo'"></div>
                <div class="leader-profile-info">
                    <h2>${escapeHtml(leader.name)}</h2>
                    <p class="leader-profile-title">${escapeHtml(leader.title)}</p>
                    <div class="leader-profile-section"><h4>📋 Biography</h4><p>${escapeHtml(leader.bio || 'No biography available.')}</p></div>
                    <div class="leader-profile-section"><h4>📞 Contact Information</h4><p>📞 ${escapeHtml(leader.phone || 'Not available')}</p></div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching leader details:', error);
        alert('Unable to load leader details: ' + error.message);
    }
}

function closeLeaderModal() {
    document.getElementById('leaderModal').style.display = 'none';
}

// ============================================
// ADVERTISEMENT
// ============================================

async function fetchAdvert() {
    try {
        const response = await fetch(`${API_URL}/advert`);
        if (!response.ok) throw new Error('Failed to fetch advert');
        const advert = await response.json();
        displayAdvert(advert);
        setupAdvertButton(advert);
    } catch (error) {
        console.error('Error fetching advert:', error);
        displayFallbackAdvert();
    }
}

function displayAdvert(advert) {
    const flyerImg = document.getElementById('advertFlyer');
    const businessName = document.getElementById('advertBusinessName');
    const description = document.getElementById('advertDescription');
    if (flyerImg) flyerImg.src = advert.flyer || 'flyer/Advertisehere.jpg';
    if (businessName) businessName.textContent = advert.businessName || 'Advertise Here';
    if (description) description.textContent = advert.description || 'Reach our church community';
    window.currentAdvert = advert;
}

function displayFallbackAdvert() {
    const flyerImg = document.getElementById('advertFlyer');
    const businessName = document.getElementById('advertBusinessName');
    const description = document.getElementById('advertDescription');
    if (flyerImg) flyerImg.src = 'https://via.placeholder.com/400x500/2c3e50/white?text=Advertise+Here';
    if (businessName) businessName.textContent = 'Advertise Here';
    if (description) description.textContent = 'Reach our church community';
}

function setupAdvertButton(advert) {
    const learnMoreBtn = document.getElementById('advertLearnMoreBtn');
    if (learnMoreBtn) learnMoreBtn.onclick = () => showAdvertDetails(advert);
}

function showAdvertDetails(advert) {
    const modal = document.getElementById('advertModal');
    const modalContent = document.getElementById('advertModalContent');
    
    let productsHtml = '<ul style="list-style: none; padding: 0;">';
    if (advert.products && advert.products.length > 0) {
        for (let i = 0; i < advert.products.length; i++) productsHtml += `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(advert.products[i])}</li>`;
    } else {
        productsHtml += '<li>Contact us for products and services</li>';
    }
    productsHtml += '</ul>';
    
    modalContent.innerHTML = `
        <div class="advert-popup-header"><div class="advert-popup-icon">🏪</div><h2 class="advert-popup-name">${escapeHtml(advert.businessName)}</h2></div>
        <div class="advert-popup-section"><h4>📋 About</h4><p>${escapeHtml(advert.description)}</p></div>
        <div class="advert-popup-section"><h4>🛍️ Products & Services</h4>${productsHtml}</div>
        <div class="advert-popup-section"><h4>📞 Contact Information</h4><p><strong>Phone:</strong> <a href="tel:${advert.phone}">${advert.phone}</a></p><p><strong>WhatsApp:</strong> <a href="https://wa.me/${advert.whatsapp ? advert.whatsapp.replace(/[^0-9]/g, '') : ''}" target="_blank">${advert.whatsapp}</a></p></div>
        <div class="advert-popup-buttons"><button class="advert-call-btn" onclick="window.location.href='tel:${advert.phone}'">📞 Call Now</button><button class="advert-whatsapp-btn" onclick="window.open('https://wa.me/${advert.whatsapp ? advert.whatsapp.replace(/[^0-9]/g, '') : ''}', '_blank')">💬 WhatsApp</button></div>
    `;
    modal.style.display = 'block';
}

function closeAdvertModal() {
    document.getElementById('advertModal').style.display = 'none';
}

// ============================================
// HERO SLIDER
// ============================================

let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const autoRotateTime = 8000;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    let newIndex = currentSlide + 1;
    if (newIndex >= slides.length) newIndex = 0;
    showSlide(newIndex);
}

function prevSlide() {
    let newIndex = currentSlide - 1;
    if (newIndex < 0) newIndex = slides.length - 1;
    showSlide(newIndex);
}

function startAutoRotate() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, autoRotateTime);
}

function stopAutoRotate() {
    if (slideInterval) clearInterval(slideInterval);
    setTimeout(startAutoRotate, 5000);
}

if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoRotate(); });
if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoRotate(); });
dots.forEach((dot, index) => { dot.addEventListener('click', () => { showSlide(index); stopAutoRotate(); }); });
startAutoRotate();

const sliderContainer = document.querySelector('.hero-slider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => { if (slideInterval) clearInterval(slideInterval); });
    sliderContainer.addEventListener('mouseleave', () => { startAutoRotate(); });
}

// ============================================
// DATE & TIME DISPLAY
// ============================================

function updateNavDateTime() {
    const now = new Date();
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateElement = document.getElementById('navDate');
    const timeElement = document.getElementById('navTime');
    if (dateElement) dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    if (timeElement) timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
}
updateNavDateTime();
setInterval(updateNavDateTime, 60000);

// ============================================
// BIBLE VERSE OF THE DAY
// ============================================

const DAILY_VERSE_API = 'https://beta.ourmanna.com/api/v1/get?format=json';
const RANDOM_VERSE_API = 'https://beta.ourmanna.com/api/v1/get?format=json&order=random';
const fallbackVerses = [
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
    { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" }
];

let todaysVerse = null;
let lastFetchDate = null;

async function fetchVerse(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data && data.verse && data.verse.details) {
            return { text: data.verse.details.text, reference: data.verse.details.reference };
        }
        return null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

async function getVerseOfTheDay() {
    const today = new Date().toDateString();
    if (todaysVerse && lastFetchDate === today) return todaysVerse;
    const verse = await fetchVerse(DAILY_VERSE_API);
    if (verse) {
        todaysVerse = verse;
        lastFetchDate = today;
        return verse;
    }
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return fallbackVerses[dayOfYear % fallbackVerses.length];
}

async function displayVerseOfTheDay() {
    const verseTextElement = document.getElementById('verseText');
    const verseReferenceElement = document.getElementById('verseReference');
    if (!verseTextElement) return;
    verseTextElement.textContent = 'Loading verse...';
    verseReferenceElement.textContent = '';
    const verse = await getVerseOfTheDay();
    if (verse) {
        verseTextElement.textContent = `"${verse.text}"`;
        verseReferenceElement.textContent = `— ${verse.reference} —`;
    }
}

async function refreshVerse() {
    const verseTextElement = document.getElementById('verseText');
    const verseReferenceElement = document.getElementById('verseReference');
    if (!verseTextElement) return;
    verseTextElement.style.opacity = '0.5';
    verseTextElement.textContent = 'Getting new verse...';
    verseReferenceElement.textContent = '';
    const verse = await fetchVerse(RANDOM_VERSE_API);
    if (verse) {
        verseTextElement.textContent = `"${verse.text}"`;
        verseReferenceElement.textContent = `— ${verse.reference} —`;
    }
    verseTextElement.style.opacity = '1';
}
displayVerseOfTheDay();

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopBtn = document.getElementById('backToTopBtn');
function toggleBackToTopButton() {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) backToTopBtn.classList.add('show');
    else backToTopBtn.classList.remove('show');
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.addEventListener('scroll', toggleBackToTopButton);
if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
toggleBackToTopButton();

// ============================================
// CONTACT FORM
// ============================================

const contactForm = document.getElementById('contactForm');
const contactFormMessage = document.getElementById('contactFormMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const location = document.getElementById('contactLocation').value.trim();
        const phone = document.getElementById('contactPhone').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        
        if (!name || !phone) {
            contactFormMessage.innerHTML = '<div class="error-message">Please fill in Name and Phone Number (required)</div>';
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, location, phone, email })
            });
            const result = await response.json();
            if (response.ok) {
                contactFormMessage.innerHTML = '<div class="success-message">✅ Thank you! We will contact you soon.</div>';
                contactForm.reset();
            } else {
                contactFormMessage.innerHTML = `<div class="error-message">❌ ${result.error || 'Something went wrong'}</div>`;
            }
        } catch (error) {
            contactFormMessage.innerHTML = '<div class="error-message">❌ Network error. Please try again.</div>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            setTimeout(() => { contactFormMessage.innerHTML = ''; }, 5000);
        }
    });
}

// ============================================
// DAILY DEVOTIONAL
// ============================================

async function fetchDevotional() {
    try {
        const response = await fetch(`${API_URL}/devotional`);
        if (!response.ok) throw new Error('Failed to fetch devotional');
        const devotional = await response.json();
        displayDevotional(devotional);
    } catch (error) {
        console.error('Error fetching devotional:', error);
    }
}

function displayDevotional(devotional) {
    const imgElement = document.getElementById('devotionalImg');
    const titleElement = document.getElementById('devotionalTitle');
    const dateElement = document.getElementById('devotionalDate');
    if (imgElement) {
        imgElement.src = devotional.imageUrl;
        imgElement.alt = devotional.title;
        imgElement.onerror = function() { this.src = 'https://via.placeholder.com/400x500/4CAF50/white?text=Daily+Devotional'; };
    }
    if (titleElement) titleElement.textContent = devotional.title;
    if (dateElement) dateElement.textContent = devotional.date;
}

function openDevotionalModal() {
    const imgSrc = document.getElementById('devotionalImg').src;
    const modal = document.createElement('div');
    modal.className = 'devotional-modal';
    modal.innerHTML = `
        <span class="close-btn" onclick="this.parentElement.remove()">&times;</span>
        <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
            <img src="${imgSrc}" alt="Daily Devotional" style="max-width: 90%; max-height: 90%; width: auto; height: auto; object-fit: contain; border-radius: 10px;">
        </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = function(e) {
        if (e.target === modal || e.target.classList.contains('close-btn')) modal.remove();
    };
}

// ============================================
// WEEKLY OUTLOOK
// ============================================

async function fetchWeeklyOutlook() {
    try {
        const response = await fetch(`${API_URL}/weekly-outlook`);
        if (!response.ok) throw new Error('Failed to fetch weekly outlook');
        const data = await response.json();
        displayWeeklyOutlook(data);
    } catch (error) {
        console.error('Error fetching weekly outlook:', error);
        const container = document.getElementById('weeklyOutlookContainer');
        if (container) container.innerHTML = '<div class="weekly-outlook-empty">Unable to load weekly outlook.</div>';
    }
}

function displayWeeklyOutlook(data) {
    const container = document.getElementById('weeklyOutlookContainer');
    if (!container) return;
    
    if (!data.pdfUrl || data.pdfUrl === '') {
        container.innerHTML = `<div class="weekly-outlook-empty"><p>📅 No weekly outlook available yet.</p><p style="font-size: 12px;">Check back soon!</p></div>`;
        return;
    }
    
    container.innerHTML = `
        <div class="weekly-outlook-title">📋 ${escapeHtml(data.title)}</div>
        <div class="weekly-outlook-date">📅 ${data.date}</div>
        <div class="weekly-outlook-description">${escapeHtml(data.description || 'Download or view this week\'s church bulletin and announcements.')}</div>
        <div class="weekly-outlook-buttons">
            <button class="weekly-outlook-view-btn" onclick="viewPDF('${data.pdfUrl}')">📖 View Online</button>
            <a href="${data.pdfUrl}" download class="weekly-outlook-download-btn">📥 Download PDF</a>
        </div>
    `;
}

function viewPDF(pdfUrl) {
    // Fix the path - replace backslashes with forward slashes
    let fullUrl = pdfUrl.replace(/\\/g, '/');
    
    // Ensure it starts with /
    if (fullUrl && !fullUrl.startsWith('http') && !fullUrl.startsWith('/')) {
        fullUrl = '/' + fullUrl;
    }
    
    console.log('Opening PDF in modal:', fullUrl);
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="position: relative; width: 90%; height: 90%; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 30px rgba(0,0,0,0.5);">
            <span style="position: absolute; top: -45px; right: -10px; color: white; font-size: 35px; cursor: pointer; background: rgba(0,0,0,0.6); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.3s;">&times;</span>
            <iframe src="${fullUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close button
    const closeBtn = modal.querySelector('span');
    closeBtn.onclick = function() {
        modal.remove();
    };
    closeBtn.onmouseenter = function() {
        this.style.backgroundColor = 'red';
        this.style.transform = 'scale(1.1)';
    };
    closeBtn.onmouseleave = function() {
        this.style.backgroundColor = 'rgba(0,0,0,0.6)';
        this.style.transform = 'scale(1)';
    };
    
    // Close on background click
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // Close on Escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(modal)) {
                modal.remove();
            }
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}
// ============================================
// DROPDOWN NAVIGATION FUNCTIONS
// ============================================

function scrollToAnnouncements() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const announcementsCard = document.querySelector('#announcementsList');
            if (announcementsCard) announcementsCard.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
}

function scrollToEvents() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const eventsCard = document.querySelector('#eventsList');
            if (eventsCard) eventsCard.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
}

function scrollToGallery() {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
    } else {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const galleryCard = document.querySelector('#albumsGrid');
                if (galleryCard) galleryCard.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
}
// ============================================
// HERO BUTTON NAVIGATION
// ============================================

function scrollToServices() {
    // Scroll to service times or contact section
    const contactSection = document.getElementById('contact');
    const featuresSection = document.getElementById('features');
    
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    } else if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToLiveStream() {
    // Scroll to live stream section
    const liveStreamSection = document.getElementById('livestream');
    if (liveStreamSection) {
        liveStreamSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // If no dedicated livestream section, scroll to features
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
// ============================================
// OPEN DEVOTIONAL MODAL FROM DROPDOWN
// ============================================

function openDevotionalModalFromNav() {
    // Fetch devotional data directly and open modal
    fetch(`${API_URL}/devotional`)
        .then(response => response.json())
        .then(data => {
            if (data.imageUrl && data.imageUrl !== '') {
                // Create and open devotional modal
                const imgSrc = data.imageUrl;
                const modal = document.createElement('div');
                modal.className = 'devotional-modal';
                modal.innerHTML = `
                    <span class="close-btn" onclick="this.parentElement.remove()">&times;</span>
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                        <img src="${imgSrc}" alt="Daily Devotional" style="max-width: 90%; max-height: 90%; width: auto; height: auto; object-fit: contain; border-radius: 10px;">
                    </div>
                `;
                document.body.appendChild(modal);
                
                modal.onclick = function(e) {
                    if (e.target === modal || e.target.classList.contains('close-btn')) {
                        modal.remove();
                    }
                };
            } else {
                alert('No devotional image available yet.');
            }
        })
        .catch(error => {
            console.error('Error fetching devotional:', error);
            alert('Unable to load devotional.');
        });
}

function scrollToWeeklyOutlook() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const weeklyCard = document.querySelector('.weekly-outlook-container');
            if (weeklyCard) weeklyCard.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
}

// ============================================
// DYNAMIC ORGANIZATIONS DROPDOWN
// ============================================

async function loadOrganizationsDropdown() {
    const dropdownMenu = document.getElementById('orgsDropdownMenu');
    if (!dropdownMenu) return;
    dropdownMenu.innerHTML = '<div class="loading-dropdown">⏳ Loading...</div>';
    try {
        const response = await fetch(`${API_URL}/organizations`);
        if (!response.ok) throw new Error('Failed to fetch organizations');
        const organizations = await response.json();
        if (organizations.length === 0) {
            dropdownMenu.innerHTML = '<a href="#">No organizations yet</a>';
            return;
        }
        let html = '';
        for (let i = 0; i < organizations.length; i++) {
            html += `<a href="organization.html?id=${organizations[i]._id}">🏛️ ${escapeHtml(organizations[i].name)}</a>`;
        }
        dropdownMenu.innerHTML = html;
    } catch (error) {
        console.error('Error loading organizations dropdown:', error);
        dropdownMenu.innerHTML = '<a href="index.html#organizations">📋 View All Organizations</a>';
    }
}
loadOrganizationsDropdown();

// ============================================
// MOBILE DROPDOWN MENU (Tap to open)
// ============================================

function initMobileDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        if (!trigger) return;
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        newTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });
}
window.addEventListener('load', initMobileDropdown);
window.addEventListener('resize', initMobileDropdown);

// ============================================
// CROSS-PAGE SCROLL HANDLER
// ============================================

window.addEventListener('load', function() {
    const scrollTarget = sessionStorage.getItem('scrollTo');
    if (scrollTarget) {
        sessionStorage.removeItem('scrollTo');
        setTimeout(() => {
            if (scrollTarget === 'announcements') scrollToAnnouncements();
            else if (scrollTarget === 'events') scrollToEvents();
            else if (scrollTarget === 'devotional') openDevotionalModalFromNav();
            else if (scrollTarget === 'weekly') scrollToWeeklyOutlook();
        }, 500);
    }
});
// ============================================
// OPEN WEEKLY OUTLOOK MODAL FROM DROPDOWN
// ============================================

function openWeeklyOutlookModal() {
    // First, fetch the weekly outlook data to get the PDF URL
    fetch(`${API_URL}/weekly-outlook`)
        .then(response => response.json())
        .then(data => {
            if (data.pdfUrl && data.pdfUrl !== '') {
                // Fix the path - replace backslashes with forward slashes
                let pdfUrl = data.pdfUrl.replace(/\\/g, '/');
                if (pdfUrl && !pdfUrl.startsWith('http') && !pdfUrl.startsWith('/')) {
                    pdfUrl = '/' + pdfUrl;
                }
                // Open the PDF in modal
                viewPDF(pdfUrl);
            } else {
                alert('No weekly outlook available yet.');
            }
        })
        .catch(error => {
            console.error('Error fetching weekly outlook:', error);
            alert('Unable to load weekly outlook.');
        });
}

// ============================================
// CALL ALL FETCH FUNCTIONS ON PAGE LOAD
// ============================================

fetchAnnouncements();
fetchEvents();
fetchBlogs();
fetchOrganizations();
fetchLeaders();
fetchAdvert();
fetchGallery();
fetchYouTubeVideo();
fetchDevotional();
fetchWeeklyOutlook();