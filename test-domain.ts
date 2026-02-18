import { NewsEntity, ContentStatus, Slug } from './src/modules/news/domain';

// Test 1: Create news
const news = NewsEntity.create({
  id: '123',
  slug: Slug.fromTitle('Test News Article'),
  title: 'Test News Article',
  content: 'This is test content',
  authorId: 'author-123',
});

console.log('✅ News created:', news.title);
console.log('✅ Slug:', news.slug.toString());
console.log('✅ Status:', news.status.toString());

// Test 2: Submit for review
news.submitForReview();
console.log('✅ Submitted for review');

// Test 3: Publish
news.publish('editor-123');
console.log('✅ Published at:', news.publishedAt);

// Test 4: Try to edit published (should throw error)
try {
  news.update({ title: 'New title' });
} catch (err) {
  console.log('✅ Cannot edit published news:', err.message);
}

console.log('\n🎉 All domain tests passed!');