// ============================================
// SERMON DETAIL PAGE - MATCHES YOUR SERMONS DATA
// ============================================

// Get the sermon ID or title from the URL
function getSermonId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// ============================================
// YOUR SERMONS DATA - MUST MATCH script.js EXACTLY
// ============================================
const sermons = [
    {
        title: "Walking in Faith",
        speaker: "Very Rev Kwodwo Yeboah",
        date: "March 10, 2026",
        excerpt: "Learn how to trust God's plan even when the path isn't clear.",
        icon: "🚶",
        // Additional details for the sermon page
        videoUrl: "https://www.youtube.com/embed/YbtTO7WwsU3c",  // Replace with your actual video
        description: `In this powerful message, Very Rev Kwodwo Yeboah teaches us what it truly means to walk by faith and not by sight. Using Hebrews 11 as our foundation, we explore how faith is not just believing in God, but trusting Him enough to take action.`,
        keyPoints: [
            "Faith requires action, not just belief",
            "Trusting God when you can't see the outcome",
            "The faith of Abraham as our example",
            "Practical steps to grow your faith daily"
        ],
        bibleVerses: [
            { reference: "Hebrews 11:1", text: "Now faith is confidence in what we hope for and assurance about what we do not see." },
            { reference: "2 Corinthians 5:7", text: "For we live by faith, not by sight." },
            { reference: "Romans 10:17", text: "Consequently, faith comes from hearing the message, and the message is heard through the word about Christ." }
        ],
        notes: "1. Write down one area where you need to trust God more\n2. Memorize Hebrews 11:1 this week\n3. Share your faith story with someone"
    },
    {
        title: "The Power of Prayer",
        speaker: "Very Rev Kwodwo Yeboah",
        date: "March 3, 2026",
        excerpt: "Discover the transformative power of consistent prayer.",
        icon: "🙏",
        videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",  // Replace with your actual video
        description: `Prayer is our direct line to God. In this sermon, Very Rev Kwodwo Yeboah reveals how prayer can transform your life, your family, and your community. Learn the principles of effective prayer and how to make it a daily habit.`,
        keyPoints: [
            "Prayer changes things - starting with you",
            "The Lord's Prayer as a model",
            "Persistent prayer and the parable of the persistent widow",
            "Praying in community vs. private prayer"
        ],
        bibleVerses: [
            { reference: "Philippians 4:6", text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." },
            { reference: "James 5:16", text: "The prayer of a righteous person is powerful and effective." },
            { reference: "Matthew 6:6", text: "But when you pray, go into your room, close the door and pray to your Father, who is unseen." }
        ],
        notes: "1. Set a daily prayer time this week\n2. Start a prayer journal\n3. Find a prayer partner"
    },
    {
        title: "Love Thy Neighbor",
        speaker: "Very Rev Kwodwo Yeboah",
        date: "February 25, 2026",
        excerpt: "What does it truly mean to love your neighbor as yourself?",
        icon: "❤️",
        videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",  // Replace with your actual video
        description: `Jesus gave us two great commandments: love God and love your neighbor. But who is our neighbor, and what does that love look like in practice? Very Rev Kwodwo Yeboah explores practical ways to love those around us.`,
        keyPoints: [
            "The Good Samaritan: Redefining 'neighbor'",
            "Love is action, not just words",
            "Loving difficult people",
            "Practical ways to serve your community"
        ],
        bibleVerses: [
            { reference: "Mark 12:31", text: "Love your neighbor as yourself. There is no commandment greater than these." },
            { reference: "Luke 10:27", text: "Love the Lord your God with all your heart and with all your soul and with all your strength and with all your mind'; and, 'Love your neighbor as yourself." },
            { reference: "1 John 4:20", text: "Whoever claims to love God yet hates a brother or sister is a liar." }
        ],
        notes: "1. Identify one neighbor to serve this week\n2. Look for opportunities to help\n3. Practice active listening"
    },
    {
        title: "Finding Peace in God",
        speaker: "Very Rev Kwodwo Yeboah",
        date: "February 18, 2026",
        excerpt: "Finding serenity through faith in challenging times.",
        icon: "🕊️",
        videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",  // Replace with your actual video
        description: `In a world full of anxiety and stress, God offers us His peace - a peace that surpasses all understanding. Very Rev Kwodwo Yeboah teaches how to access this peace even in the midst of life's storms.`,
        keyPoints: [
            "The difference between worldly peace and God's peace",
            "Peace through surrender, not control",
            "Casting your anxieties on Him",
            "Peace as a fruit of the Spirit"
        ],
        bibleVerses: [
            { reference: "John 14:27", text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid." },
            { reference: "Philippians 4:7", text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." },
            { reference: "Isaiah 26:3", text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you." }
        ],
        notes: "1. Practice casting your worries on God daily\n2. Memorize Philippians 4:6-7\n3. Create a peace corner in your home"
    }
];

// ============================================
// DISPLAY SERMON DETAILS
// ============================================
function displaySermonDetail() {
    const sermonId = getSermonId();
    const container = document.getElementById('sermonDetail');
    
    if (!container) return;
    
    // Find the sermon (by title since you don't have IDs)
    let sermon = null;
    
    // If we have a title parameter
    if (sermonId) {
        // Decode the URL parameter (handles spaces and special characters)
        const decodedTitle = decodeURIComponent(sermonId);
        sermon = sermons.find(s => s.title === decodedTitle);
    }
    
    // If still not found, show error
    if (!sermon) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Sermon Not Found</h2>
                <p>We couldn't find the sermon you're looking for.</p>
                <a href="index.html#sermons" class="back-button">← Back to Sermons</a>
            </div>
        `;
        return;
    }
    
    // Build the sermon detail HTML
    let html = `
        <div class="sermon-header">
            <div class="sermon-icon-large">${sermon.icon}</div>
            <h1>${sermon.title}</h1>
            <div class="sermon-meta-large">
                <span>👤 ${sermon.speaker}</span>
                <span>📅 ${sermon.date}</span>
            </div>
        </div>
        
        <!-- Video/Audio Player -->
        <div class="sermon-player">
            <div class="video-wrapper">
                <iframe src="${sermon.videoUrl}" 
                        title="${sermon.title}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="sermon-actions">
            <button class="action-btn" onclick="downloadNotes('${sermon.title}')">📥 Download Notes</button>
            <button class="action-btn" onclick="shareSermon('${sermon.title}')">📤 Share Sermon</button>
        </div>
        
        <!-- Sermon Description -->
        <div class="sermon-description">
            <h2>About This Message</h2>
            <p>${sermon.description}</p>
        </div>
        
        <!-- Key Points -->
        <div class="sermon-key-points">
            <h2>Key Points</h2>
            <ul>
                ${sermon.keyPoints.map(point => `<li>${point}</li>`).join('')}
            </ul>
        </div>
        
        <!-- Bible Verses -->
        <div class="sermon-verses">
            <h2>Scripture References</h2>
            ${sermon.bibleVerses.map(verse => `
                <div class="verse-card">
                    <strong>${verse.reference}</strong>
                    <p>${verse.text}</p>
                </div>
            `).join('')}
        </div>
        
        <!-- Study Notes / Reflection -->
        <div class="sermon-notes">
            <h2>Reflection & Application</h2>
            <div class="notes-content">
                <p>${sermon.notes.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
        
        <!-- Related Sermons -->
        <div class="related-sermons">
            <h2>More Sermons You Might Like</h2>
            <div class="related-grid">
                ${sermons.filter(s => s.title !== sermon.title).slice(0, 3).map(related => `
                    <div class="related-card" onclick="location.href='sermon.html?id=${encodeURIComponent(related.title)}'">
                        <div class="related-icon">${related.icon}</div>
                        <h4>${related.title}</h4>
                        <p>${related.speaker}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Update page title
    document.title = `${sermon.title} - Faith Community Church`;
}

// ============================================
// DOWNLOAD NOTES FUNCTION
// ============================================
function downloadNotes(sermonTitle) {
    // Find the sermon
    const sermon = sermons.find(s => s.title === sermonTitle);
    if (!sermon) return;
    
    // Create notes content
    let notesContent = `${sermon.title}\n`;
    notesContent += `${sermon.speaker} | ${sermon.date}\n`;
    notesContent += `${"=".repeat(50)}\n\n`;
    notesContent += `SERMON NOTES\n\n`;
    notesContent += `${sermon.notes}\n\n`;
    notesContent += `KEY POINTS:\n${sermon.keyPoints.map(p => `• ${p}`).join('\n')}\n\n`;
    notesContent += `SCRIPTURE VERSES:\n${sermon.bibleVerses.map(v => `${v.reference}: ${v.text}`).join('\n\n')}`;
    
    // Create download
    const blob = new Blob([notesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sermon.title.replace(/ /g, '_')}_notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// SHARE SERMON FUNCTION
// ============================================
function shareSermon(sermonTitle) {
    const url = window.location.href;
    const text = `Check out this sermon: "${sermonTitle}" from Faith Community Church`;
    
    if (navigator.share) {
        navigator.share({
            title: sermonTitle,
            text: text,
            url: url
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`${text}\n${url}`);
        alert("Link copied to clipboard! You can now share it with friends.");
    }
}

// ============================================
// LOAD THE SERMON WHEN PAGE LOADS
// ============================================
displaySermonDetail();