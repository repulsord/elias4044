document.addEventListener("DOMContentLoaded", function() {
    const newsButton = document.getElementById('newsButton');
    const newsContent = document.getElementById('newsContent');

    // Show pop-up when hovering over the button
    newsButton.addEventListener('mouseenter', function() {
        newsContent.style.maxHeight = '300px';  // Expand height
        newsContent.style.opacity = '1';        // Make it visible
    });

    // Hide pop-up when mouse leaves the button or the content
    newsButton.addEventListener('mouseleave', function() {
        setTimeout(function() {
            if (!newsContent.matches(':hover')) {
                newsContent.style.maxHeight = '0';   // Collapse height
                newsContent.style.opacity = '0';     // Hide it
            }
        }, 200); // Small delay to ensure mouse transition between button and content
    });

    // Keep pop-up open when hovering over the content
    newsContent.addEventListener('mouseenter', function() {
        newsContent.style.maxHeight = '300px';  // Keep it expanded
        newsContent.style.opacity = '1';        // Keep it visible
    });

    // Hide pop-up when mouse leaves the content
    newsContent.addEventListener('mouseleave', function() {
        newsContent.style.maxHeight = '0';      // Collapse height
        newsContent.style.opacity = '0';        // Hide it
    });
});
